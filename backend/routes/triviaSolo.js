const router = require('express').Router();
const instance = require('../models/soloTriviaInstance');
const trivia = require('../models/trivia');
const acs = require('../models/acs');

router.route('/create').post((req, res) => {

  const user = req.body.username;

  instance.remove({user: user, inProgress: true}).catch(err => res.status(400).json('Error: ' + err));

  const newGame = new instance({
    user: user
  })

  acs.findOne({username: user})
  .then(userACS => {
    newGame.save()
      .then(() => {
        res.json({instance: newGame.id, acs: userACS.acsTotal.total})
      })
      .catch(err => res.status(400).json('Error: ' + err));
  }).catch(err => res.status(400).json('Error: ' + err));

  
});

router.route('/next').put((req, res) => {


  instance.findOne({_id: req.body.instance})
  .then(game => {

    // console.log(game);

    const sendRandom = (previous) => {
      trivia.aggregate([
        { $match: { _id: { $nin: game.questionIds } } },
        { $sample: { size: 1 } } 
      ]).then(q => {
        const question = q[0];
        game.questionIds.push(question);
        game.times.push(new Date())
        game.save()
          .then(() => {
            res.json({ currentQuestion:question.question, 
                        options:question.options, previous: previous, 
                        questionCount: game.questionIds.length,
                        time: game.times[game.times.length - 1] })
          })
          .catch(err => res.status(403).json('Error: ' + err));
      }).catch(err => res.status(404).json('Error: ' + err));
    }

    const sendDone = (previous) => {
      acs.findOne({username: game.user})
      .then(userACS => 
      {
        const entry = {
          category: "Picks & Predictions",
          points: game.points,
          date: new Date()
        }

        userACS.acsHistory.push(entry);
        userACS.acsTotal.total += game.points;
        userACS.acsTotal.picksPrediciton += game.points;
        
        game.inProgress = false;
        game.save().catch(err => res.status(400).json('Error: ' + err));

        userACS.save()
          .then(() => res.json({acs: userACS.acsTotal.total, points: game.points, previous: previous}))
          .catch(err => res.status(400).json('Error: ' + err));

    }).catch(err => res.status(401).json('Error: ' + err));
    }

    const checkTime = (time) => {
      const curTime = new Date();
      if(curTime - time < 12000){
        return true;
      }
      return false;

    }

    if(game.questionIds.length > 0 && game.inProgress){
      trivia.findOne({question: req.body.question})
        .then(response => {
          if(response.answer === req.body.answer && checkTime(game.times[game.times.length - 1])){
            game.points += 1;
            game.save().then(() => {
              if (game.questionIds.length < 10) {
                sendRandom("correct")
              } else {
                sendDone("correct")
              }
            });
          } else {
            game.points -= 1;
            game.save().then(() => {
              if (game.questionIds.length < 10) {
                sendRandom("wrong")
              } else {
                sendDone("wrong")
              }
            });
          }
        }).catch(err => res.status(402).json('Error: ' + err));
    } else {
      sendRandom("none");
    }
      
    
  }).catch(err => res.status(405).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const options = req.body.options;

  const newTrivia = new trivia({
    question: question,
    answer: answer,
    options: options
  })

  newTrivia.save()
    .then(() => {
      res.json("Trivia added")
    })
    .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;