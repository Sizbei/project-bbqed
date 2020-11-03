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
      opp: "",
      accept: false
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
      queue.findOneAndUpdate({startTime: null, "payload.user": {"$ne": req.body.username}}, {startTime: new Date()}, {sort: {createdOn: 1}, new: true}).exec()
      .then(opp => {
        console.log(opp.payload.user);
        queue.findOneAndUpdate({"payload.user": req.body.username}, {startTime: new Date(), "payload.opp": opp.payload.user}).exec()
        queue.findOneAndUpdate({"payload.user": opp.payload.user}, {"payload.opp": req.body.username}).exec()
        res.json(opp.payload.user)
      })
      .catch(err => res.json("not found"));
    })
});

function setIntervals(n, f, t) {
  if (n == 0) return false;

  console.log("n: ", n);

  if (f()) {
    return true;
  }

  setTimeout(() => {
    setIntervals(n-1, f, t);
  }, t)
}

function testfunc2() {
  var promise = new Promise((resolve, reject) => {
    console.log("wait 2");
    setTimeout(() => {
      resolve(true);
    }, 5000)
  })
  return promise;
}

function testfunc() {
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve(true);
      console.log("wait 1");
      testfunc2().then(d => {
        resolve(d);
      })
    }, 5000)
  })
  return promise;
}

function setIntervals(n, f, t) {
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (n == 0) {
        resolve(false);
      }
      
      f()
      .then((d) => {
        if (d != null) {
          console.log("resolve true");
          resolve(true);
        } else {
          setIntervals(n - 1, f, t).then(d => {
            resolve(d);
          })
        }
      })
      .catch(() => {
        setIntervals(n - 1, f, t).then(d => {
          resolve(d);
        })
      })
    }, t)
  })
  return promise;
}

router.route('/createGame').post((req, res) => {
  
  // const d = await testfunc();
  // res.json(d);
  
  queue.findOneAndUpdate({startTime: {"$ne": null},  "payload.user": req.body.username}, {"payload.accept": true})
  .then(user => {
      setIntervals(10, () => queue.findOne({startTime: {"$ne": null},  "payload.user": user.payload.opp, "payload.accept": true}), 1000).then((d) => {
        if (d) {
          // Initialize instance
          res.json(d);
        } else {
          user.startTime = null;
          user.payload.accept = false;
          user.markModified('startTime');
          user.markModified('payload.accept');
          user.save().then(() => res.json("Match Declined"));
        }
      })
    })
    .catch(err => res.json("Waiting 2"))
});

module.exports = router;