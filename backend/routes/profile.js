//Start every route with these lines - connects with model
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Profile = require('../models/profile');
let Teams = require('../models/team');
let Acs = require('../models/acs');
const { isAssertionExpression } = require('typescript');

//get method
router.route('/:username').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  Profile.findOne({username: req.params.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/teams').get(passport.authenticate('jwt', {session : false}),(req, res) => {
  Teams.find().where('name').in(req.query.teams.split(',')).exec()
    .then(teams => res.json(teams))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/radarlist').get(async (req,res) => {
  Profile.findOne({username: req.params.username})
  .then(async (user) => {
    let tempAcs = 0;
    var tempPic = "";
    var radarList = [];
    for (var i = 0; i < user.radarList.length; i++) {
      tempAcs = await Acs.findOne({username:user.radarList[i]}).then(acs => {return acs.acsTotal[0].total});
      tempPic = await Profile.findOne({username: user.radarList[i]}).then(profile => {return profile.image});
        radarList[i] = {username: user.radarList[i], acs:tempAcs, profilePic:tempPic}
    }
    res.json({radarList: radarList})})
  .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:username/:viewing/checkRadar').get(async (req,res) => {
  await Profile.findOne({username:req.params.username}).then(async (user) => {
    var following = false;
    for (var i = 0; i < user.radarList.length; i ++) {
      if (user.radarList[i] === req.params.viewing) {
        following = true;
      }
    }
    res.json({"following":following})
  }).catch(err => res.status(400).json('Error ' + err));
})

router.route('/:username/addRadar').put(async (req, res) => {
  await Profile.updateOne({username: req.body.username}, {$push: {radarList:[req.body.viewing]}}).then(
    res.json("Added friend")
  ).catch(err => res.status(400).json('Error ' + err));
})

module.exports = router;