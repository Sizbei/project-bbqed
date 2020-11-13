//Start every route with these lines - connects with model
const router = require('express').Router();
let analysis = require('../models/analysis');
let analysisPost = require('../models/analysispost');
let acs = require('../models/acs');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route('/').put(async (req, res) => {

});

router.route('/:id').get(async (req, res) => {

});

module.exports = router;