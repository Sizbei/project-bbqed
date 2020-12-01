const router = require('express').Router();
let playoff = require('../models/playoff');
let prediction = require('../models/prediction');
let game = require('../models/game');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route("/bracket/:year").post(passport.authenticate('jwt', {session : false}),(req, res) => {
  playoff.findOne({year: req.params.year}).then(bracket => res.json(bracket))
  .catch(err => res.status(400).json({err: err}));
});

router.route("/result/:gameId").get(passport.authenticate('jwt', {session : false}),(req, res) => {
  game.findOne({_id: req.params.gameId})
  .then(g => {

    if(g.gameDay > new Date()){
      res.json({result: g.result, open: true});
    } else {
      res.json({result: g.result, open: false});
    }
    
  })
  .catch(err => res.status(400).json({err: err}));
});

router.route("/pick/:user/:gameId").get(passport.authenticate('jwt', {session : false}),(req, res) => {
  prediction.findOne({game: req.params.gameId, picks: {user: req.params.user}})
  .then(p => {
    res.json({result: g.result});
  })
  .catch(err => res.status(400).json({err: err}));
});


router.route("/add").put(passport.authenticate('jwt', {session : false}),(req, res) => {
  prediction.findOne({game: req.body.gameId})
  .then(game => {
    const user = req.body.user;
    const team = req.body.team;
    const userPick = {
      user: user,
      pick: pick,
    }
    game.prediction.push(userPick);
    game.save().then(() => res.json("Prediction added"));
  })
});


module.exports = router;