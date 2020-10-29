const router = require('express').Router();
const instance = require('../models/soloTriviaInstace');
const trivia = require('../models/trivia');
const acs = require('../models/acs');

router.route('/create').post((req, res) => {

  const user = req.body.username;

  const newGame = new instance({
    user: user
  })

  newGame.save()
  .then(() => {
    res.json("Game created")
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/next').put((req, res) => {

    if(req.body.instance.questionIds.length == 10){
      acs.findOne({username: req.body.instance.username})
        .then(userACS => 
        {
          const entry = {
            categroy: "Picks&Predictions",
            points: req.body.instance.points,
            date: new Date ()
          }
          userACS.acsHistory.push(entry);
          userACS.acsTotal.total += req.body.instance.points;
          userACS.acsTotal.picksPrediciton += req.body.instance.points;
          userACS.save()
            .then(() => res.json('Points updated'))
            .catch(err => res.status(400).json('Error: ' + err));

      }).catch(err => res.status(400).json('Error: ' + err));

    } else {
        trivia.aggregate([{"$match": { _id: { "$nin:" : req.body.instance.questionIds } } }])
          .then(question => {
            req.body.instance.questionIds.push(question);
            req.body.instance.questionIds.save()
            .then(() => res.json(question))
            .catch(err => res.status(400).json('Error: ' + err));
          })
    }
    
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