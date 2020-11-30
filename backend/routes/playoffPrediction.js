const router = require('express').Router();
let playoff = require('../models/playoff');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

router.route("/bracket/:year").post(passport.authenticate('jwt', {session : false}),(req, res) => {
  playoff.findOne({year: req.params.year}).then(bracket => res.json(bracket))
  .catch(err => res.status(400).json({err: err}));
});


module.exports = router;