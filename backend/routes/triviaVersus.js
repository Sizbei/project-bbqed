//Start every route with these lines - connects with model
const router = require('express').Router();
let trivia = require('../models/trivia');
let acs = require('../models/acs');
let queue = require('../models/queue');

router.route('/joinQueue').post((req, res) => {
  const user = req.body.username;
  const acs = req.body.acs;

  queue.remove(queue.findOne({"payload.user": user})).exec();

  const join = new queue({
    startTime: null,
    endTime: null,
    createdOn: new Date(),
    priority: 1,
    payload: {
      user: user,
      acs: acs,
      opp: ""
    }
  })

  join.save()
    .then(() => {
      res.json("Joined queue")
    })
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/leaveQueue/:username').delete((req, res) => {
  queue.remove(queue.findOne({"payload.user": req.params.username}))
    .then(() => res.json("Left queue"))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findMatch').put((req, res) => {

  queue.findOne({startTime: {"$ne": null}, "payload.user": req.body.username})
    .then(user => res.json(user.payload.opp))
    .catch(() => {
      queue.findOneAndUpdate({startTime: null, "payload.user": {"$ne": req.body.username}}, {startTime: new Date()}, {sort: {createdOn: 1}, new: true})
      .then(opp => {
        queue.findOneAndUpdate({"payload.user": opp.payload.user}, {startTime: new Date(), "payload.opp": req.body.username})
        queue.findOneAndUpdate({"payload.user": req.body.username}, {"payload.opp": opp.payload.user})
        res.json(opp.payload.user)
      })
      .catch(err => res.json("not found"));
    })
});

router.route('/createGame').post((req, res) => {
  queue.findOne({startTime: {"$ne": null},  "payload.user": req.body.user, "payload.opp": req.body.opp})
    //.then(() => res.json("Accepted"))
    .catch(err => res.json("Waiting"))
});

module.exports = router;