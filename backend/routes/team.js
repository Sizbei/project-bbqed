const router = require('express').Router();
let Team = require('../models/team');

//get method
router.route('/').get((req, res) => {
    Team.find()
        .then((team) => res.json(team))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;