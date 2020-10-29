//Start every route with these lines - connects with model
const router = require('express').Router();
let trivia = require('../models/trivia');
let acs = require('../models/acs');
let queue = require('../models/queue');
let triviaQuestion = require('../models/triviaquestion');
let headToHeadGame = require('../models/headtoheadgame');

// set the time limit for each trivia question, unit in sec
const timeLimit = 10;
// set the total number of question in one round of trivia
// set to 4 as there are only 4 sample questions in db
const questionCount = 4;

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
      acs: acs
    }
  })

  join.save()
    .then(() => {
      res.json("Joined queue")
    })
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/leaveQueue').delete((req, res) => {
  queue.remove(queue.findOne({"payload.user": req.body.username}))
    .then(() => res.json("Left queue"))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findMatch').put((req, res) => {
  queue.findOneAndUpdate({startTime: null, "payload.user": {"$ne": req.body.username}}, {startTime: null}, {sort: {createdOn: 1}, new: true})
    .then(opp => res.json(opp.payload.user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//-------------------------------------------------
// Supporting functions for head-to-head trivia game
//-------------------------------------------------

const closeQuestion = (game, curTrivia) => {
  // find the trivia question relating with current question index
  const questionIndex = game.currentQuestionIndex;
  const curQuestion = game.questions[questionIndex];
  let winerIndex = 0;
  if (curQuestion.responses[winerIndex].answer &&
    curQuestion.responses[winerIndex].answer == curTrivia.answer) {
    if(curQuestion.responses[1].answer && curQuestion.responses[1].answer == curTrivia.answer) {
      // if both users submit responses and correct
      if(curQuestion.responses[winerIndex].responseTime > curQuestion.responses[1].responseTime){
        // and then if user 2 submit the response earlier
        winerIndex = 1;
      }
    }
  } else {
    if(curQuestion.responses[1].answer && curQuestion.responses[1].answer == curTrivia.answer) {
      // if only user2 submit the response and correct
      winerIndex = 1;
    } else {
      winerIndex = -1;
    }
  }
  // update the points
  if(winerIndex !== -1) {
    let cur_point = game.points[winerIndex] + 1;
    game.points.set(winerIndex, cur_point);
  }
  // move to next question
  if(game.currentQuestionIndex < questionCount - 1) {
    game.currentQuestionIndex += 1;
    game.questions[game.currentQuestionIndex].startTime = new Date();
  } else {
    game.status = 'close';
  }
  return game;
}

// update and save the given head-to-head game document, retuen the updated document
const updateHeadToHeadDocument = (game, curTrivia) => {
  // find the trivia question relating with current question index
  const questionIndex = game.currentQuestionIndex;
  const curQuestion = game.questions[questionIndex];
  // check if the start time of the current question exists
  if(curQuestion.startTime) {
    const cur_date = new Date();
    // check if the question is still in time limit
    if((cur_date - curQuestion.startTime)/1000 <= timeLimit) {
      // check if both users has submitted responses
      if (curQuestion.responses[0].answer && curQuestion.responses[0].answer) {
        game = closeQuestion(game, curTrivia);
      }
      console.log('no need for close');
    // if time limit reached, close the question
    } else {
      game = closeQuestion(game, curTrivia);
    }
  // if start time doesn't exist, set it to current time
  } else {
    game.questions[questionIndex].startTime = new Date();
  }
  return game;
}

const generateGameInstance = (game, curTrivia, username) => {
  const userIndex = game.users.indexOf(username);
  let opponentIndex = 0;
  if (userIndex === 0) {
    opponentIndex = 1;
  }
  const gameInstance = {
    user: {
      username: game.users[userIndex],
      point: game.points[userIndex]
    },
    opponent: {
      username: game.users[opponentIndex],
      point: game.points[opponentIndex]
    },
    currentTrivia: {
      index: game.currentQuestionIndex,
      question: curTrivia.question,
      answer: curTrivia.answer,
      options: curTrivia.options
    }
  }
  return gameInstance;
}

// with given two users as string, init the head-to-head geme document in DB
// Model.aggregate([{$sample: {size: 1}}])
const initHeadToHeadGame = (user1, user2) => {
  const game = new headToHeadGame({
    users: [user1, user2],
    status: 'open',
    points: [0, 0],
    currentQuestionIndex: 0,
    questions: [
      {
        triviaQuestion: '5f99c5a85c16a228685c63aa',
        responses: [{},{}]
      },
      {
        triviaQuestion: '5f99c5e8686dbb09d0ea7ff8',
        responses: [{},{}]
      },
      {
        triviaQuestion: '5f99c60d5f9a7d165c7aa88d',
        responses: [{},{}]
      },
      {
        triviaQuestion: '5f99c6201f9a982230ecb0d4',
        responses: [{},{}]
      }
    ]
  });
  game.save();
}

//-------------------------------------------------
// Routes for head-to-head trivia game
//-------------------------------------------------

// a request to update the DB and respond back a updated snapshot of head-to-head trivia information in DB
// request format: {usermame: str}
router.route('/headToHead/update').put((req, res) => {
  headToHeadGame.findOne({users: req.body.username, status: 'open'})
    .then(game => {
      if(game) {
        triviaQuestion.findById({_id: game.questions[game.currentQuestionIndex].triviaQuestion})
          .then(curTrivia => {
            game = updateHeadToHeadDocument(game, curTrivia);
            game.save()
              .then(() => {
                triviaQuestion.findById({_id: game.questions[game.currentQuestionIndex].triviaQuestion})
                  .then(curTrivia => {
                    gameInstance = generateGameInstance(game, curTrivia, req.body.username);
                    res.json({msg: "Document updated", gameInstance: gameInstance});
                  });
              })
              .catch(err => res.status(500).json({msg: err}));
          });
      } else {
        res.status(400).json({msg: 'Bad request'});
      }
    })
    .catch(err => res.status(500).json({msg: 'Internal service error'}));
});

// a request to submit trivia question answer to DB
// request format: {username: str, answer: str}
router.route('/headToHead/submit').post((req, res) => {
  headToHeadGame.findOne({users: req.body.username, status: 'open'})
    .then(game => {
      if(game) {
        const userIndex = game.users.indexOf(req.body.username);
        game.questions[game.currentQuestionIndex].responses[userIndex] = {
          answer: req.body.answer,
          responseTime: new Date()
        }
        game.save()
          .then(() => res.json({msg: "Response submitted"}))
          .catch(err => res.status(500).json({msg: 'Internal service error'}));
      } else {
        res.status(400).json({msg: 'Bad request'});
      }
    })
    .catch(err => res.status(500).json({msg: 'Internal service error'}));
});

router.route('/headToHead/test').post((req, res) => {
  initHeadToHeadGame('test1', 'test2');
  //initHeadToHeadGame('test3', 'test4');
  //initHeadToHeadGame('test5', 'test6');
  res.json({msg: 'done'});
});

module.exports = router;