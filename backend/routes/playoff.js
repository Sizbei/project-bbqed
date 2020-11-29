const router = require('express').Router();
let playoff = require('../models/playoff');
let game = require('../models/game');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');


router.route("/:year/:team1/:team2").get((req, res) => {
  
  const year = req.params.year;
  const team1 = req.params.team1;
  const team2 = req.params.team2;
  
  game.find({
    type: "playoff",
    team1: team1,
    team2: team2, 
    gameDay: {
      $gte: new Date(year, 1, 1),
      $lte: new Date(year, 12, 31)
    }
  }).then(games => {
    const gameIds = []
    const score = [0,0]
    const result = ''

    for(g in games){
      gameIds.push(g.id);
      if(g.result === team1){
        score[0]++;
      }else if(g.result === team2){
        score[1]++;
      }
    }

    if(score[0] == 4){
      result = team1;
    }else if(score[1] == 4){
      result = team2;
    }

    res.json({gameIds: gameIds, score: score, result: result});

  })
  .catch(() => {
    res.json({gameIds: [], score: [0,0], result: ''})})

});

router.route("/add").post((req, res) => {
  playoff.findOneAndDelete({year: req.body.year}).then(() => {
    
    const year = req.body.year;
    const easternConference = req.body.easternConference;
    const westernConference = req.body.westernConference;
    console.log(westernConference)
    const finals = req.body.finals;
    
    const newPlayoff = new playoff({
      year: year,
      easternConference: easternConference,
      westernConference: westernConference,
      finals: finals,
    })

    newPlayoff.save()
      .then(() => {
        res.json("Playoff added")
      })
      .catch(err => res.status(400).json('Error: ' + err));

  })
});

module.exports = router;