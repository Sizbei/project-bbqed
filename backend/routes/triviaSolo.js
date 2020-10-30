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

    console.log(game);

    if(game.questionIds.length == 10){
      acs.findOne({username: game.username})
        .then(userACS => 
        {
          console.log("username found.");
          const entry = {
            category: "Picks&Predictions",
            points: game.points,
            date: new Date()
          }
          userACS.acsHistory.push(entry);
          userACS.acsTotal.total += game.points;
          userACS.acsTotal.picksPrediciton += game.points;
          userACS.save()
            .then(() => res.json({acs: userACS.acsTotal.total, points: game.points}))
            .catch(err => res.status(400).json('Error: ' + err));

      }).catch(err => res.status(401).json('Error: ' + err));

    } else {
      console.log("hello");

      const sendRandom = (previous) => {
        trivia.aggregate([
          { $match: { _id: { $nin: game.questionIds } } },
          { $sample: { size: 1 } } 
        ]).then(q => {
          const question = q[0];
          console.log("question", question);
            game.questionIds.push(question);
            console.log("bad");
            game.save()
              .then(() => {
                console.log("good");
                console.log({ currentQuestion:question.question, 
                  options:question.options, previous: previous, questionCount: game.questionIds.length });
              return res.json({ currentQuestion:question.question, 
                options:question.options, previous: previous, questionCount: game.questionIds.length })
              })
              .catch(err => res.status(403).json('Error: ' + err));
          }).catch(err => res.status(404).json('Error: ' + err));
      }

      if(game.questionIds.length > 0){
        console.log("hellow");
        console.log("not running");
        trivia.findOne({question: req.body.question})
          .then(response => {
            console.log("step 2");
            if(response.answer === req.body.answer){
              console.log("step 3");
              game.points += 1;
              game.save().then(sendRandom("correct"));
            } else {
              game.points -= 1;
              game.save().then(sendRandom("wrong"));
            }
          }).catch(err => res.status(402).json('Error: ' + err));
      } else {
        sendRandom("none");
      }
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