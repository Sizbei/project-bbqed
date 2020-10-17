const router = require('express').Router();
let Team = require('../models/team');

//get method
router.route('/').get((req, res) => {
    const name = req.body.name;
    Team.findOne({name: name})
        .then((team) => res.json(team.image))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;