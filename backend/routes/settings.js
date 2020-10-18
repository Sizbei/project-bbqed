//Start every route with these lines - connects with model
const router = require('express').Router();
let Profile = require('../models/Profile');

router.route('/profile').get((req, res) => {
  Profile.findOne({username: req.body.username})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;