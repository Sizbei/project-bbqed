const router = require('express').Router();
const instance = require('../models/soloTriviaInstance');
const trivia = require('../models/trivia');
const acs = require('../models/acs');

router.route('/create').post((req, res) => {

  const user = req.body.username;

  const newGame = new instance({
    user: user
  })

  newGame.save()
  .then(() => {
    res.json(newGame.id)
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/next').put((req, res) => {


  instance.findOne({_id: req.body.instance})
  .then(game => {

    if(game.questionIds.length == 10){
      acs.findOne({username: game.username})
        .then(userACS => 
        {
          const entry = {
            categroy: "Picks&Predictions",
            points: game.points,
            date: new Date ()
          }
          userACS.acsHistory.push(entry);
          userACS.acsTotal.total += game.points;
          userACS.acsTotal.picksPrediciton += game.points;
          userACS.save()
            .then(() => res.json('Points updated'))
            .catch(err => res.status(400).json('Error: ' + err));

      }).catch(err => res.status(400).json('Error: ' + err));

    } else {

      if(game.questionIds.length > 0){
        trivia.findOne({_id: req.body.question})
            .then(response => {
              if(response.answer === req.body.answer){
                game.points += 1;
                game.save();
              }
            }).catch(err => res.status(400).json('Error: ' + err));
      }

      trivia.aggregate([{"$match": { _id: { "$nin:" : req.body.instance.questionIds } } }])
        .then(question => {
          game.questionIds.push(question);
          game.save()
            .then(() => res.json(question))
            .catch(err => res.status(400).json('Error: ' + err));
        }).catch(err => res.status(400).json('Error: ' + err));

    }

  }).catch(err => res.status(400).json('Error: ' + err));

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