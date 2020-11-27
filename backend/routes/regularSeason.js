//Start every route with these lines - connects with model
const router = require('express').Router();
let game = require('../models/game');
let team = require('../models/team');
let prediction = require('../models/prediction');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route('/addSeasonGames').put((req, res) => {


})

module.exports = router;