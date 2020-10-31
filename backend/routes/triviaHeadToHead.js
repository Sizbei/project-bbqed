//Start every route with these lines - connects with model
const router = require('express').Router();
let trivia = require('../models/trivia');
let acs = require('../models/acs');
let queue = require('../models/queue');
let headToHeadGame = require('../models/headtoheadgame');

// set the time limit for each trivia question, unit in sec
const timeLimit = 30;
// set the total number of question in one round of trivia
// set to 4 as there are only 4 sample questions in db
const questionCount = 10;

//-------------------------------------------------
// Supporting functions for head-to-head trivia game
//-------------------------------------------------

const closeQuestion = game => {
    // find the trivia question relating with current question index
    const questionIndex = game.currentQuestionIndex;
    const curQuestion = game.questions[questionIndex];
    console.log(curQuestion);
    let winerIndex = 0;
    console.log('1-3-1: check if user1 response to question correctlty');
    if (curQuestion.responses[winerIndex].answer &&
        curQuestion.responses[winerIndex].answer == curQuestion.triviaQuestion.answer) {
        console.log('1-3-2: user1 passed check and now check user2');
        if(curQuestion.responses[1].answer &&
            curQuestion.responses[1].answer == curQuestion.triviaQuestion.answer) {
            console.log('1-3-3: user2 passed check and now compare the response times');
            // if both users submit responses and correct
            if(curQuestion.responses[winerIndex].responseTime > curQuestion.responses[1].responseTime){
                // and then if user 2 submit the response earlier
                console.log('1-3-4: user2 response faster');
                winerIndex = 1;
            }
            console.log('1-3-4: user1 response faster');
        }
    } else {
        console.log('1-3-6: user1 failed check and now check user2');
        if(curQuestion.responses[1].answer &&
            curQuestion.responses[1].answer == curQuestion.triviaQuestion.answer) {
            // if only user2 submit the response and correct
            console.log('1-3-7: user2 passed ckeck');
            winerIndex = 1;
        } else {
            console.log('1-3-8: user2 failed check');
            winerIndex = -1;
        }
    }
    console.log('1-3-9: update points if there is a winner');
    // update the points
    if(winerIndex !== -1) {
        console.log('1-3-10: there is a winner');
        let cur_point = game.points[winerIndex] + 1;
        game.points.set(winerIndex, cur_point);
        console.log('1-3-11: winner point updated');
    }
    // move to next question
    if(game.currentQuestionIndex < questionCount - 1) {
        console.log('1-3-12: move to next question');
        game.currentQuestionIndex += 1;
        game.questions[game.currentQuestionIndex].startTime = new Date();
    } else {
        console.log('1-3-13: last question so close the trivia');
        game.status = 'close';
    }
    return game;
}

// update and save the given head-to-head game document, retuen the updated document
const updateHeadToHeadDocument = game => {
    // find the trivia question relating with current question index
    const questionIndex = game.currentQuestionIndex;
    const curQuestion = game.questions[questionIndex];
    console.log('1-1: start updating the game document');
    // check if the start time of the current question exists
    if(curQuestion.startTime) {
        const cur_date = new Date();
        console.log('1-2: ckeck current time with timer');
        // check if the question is still in time limit
        if((cur_date - curQuestion.startTime)/1000 <= timeLimit) {
            // check if both users has submitted responses
            if (curQuestion.responses[0].answer && curQuestion.responses[0].answer) {
                console.log('1-3: timer is still on but both users have completed responses');
                game = closeQuestion(game);
                console.log('1-4: question is closed and moved to next question');
        }
        // if time limit reached, close the question
        } else {
            console.log('1-5: timer is out');
            game = closeQuestion(game);
            console.log('1-6: question is closed and moved to next question');
        }
    // if start time doesn't exist, set it to current time
    } else {
        console.log('1-7: start the timer on first question');
        game.questions[questionIndex].startTime = new Date();
    }
    return game;
}

//-------------------------------------------------
// Routes for head-to-head trivia game
//-------------------------------------------------

// a request to update the DB and respond back a updated snapshot of head-to-head trivia information in DB
// request format: {usermame: str}
router.route('/update').put((req, res) => {
    console.log('==============update===============');
    headToHeadGame.findOne({users: req.body.username, status: 'open'})
        .then(game => {
        if(game) {
            console.log('1: able to find the head to head game in DB');
            game = updateHeadToHeadDocument(game);
            console.log('2: game document updated');
            game.save()
            .then(() => {
                console.log('3: game document saved');
                res.json({msg: "Document updated", gameInstance: game});
            })
            .catch(err => res.status(500).json({msg: err}));
        } else {
            res.status(400).json({msg: 'Bad request'});
        }
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
});

// a request to submit trivia question answer to DB
// request format: {username: str, answer: str}
router.route('/submit').post((req, res) => {
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
            .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
        } else {
            res.status(400).json({msg: 'Bad request'});
        }
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
});

// init a head-to-head game
// request format: {user1: str, user2: str}
router.route('/init').post((req, res) => {
    // get 10 random trivia question from DB and use them to init the game
    trivia.aggregate([{$sample: {size: 10}}])
        .then(trivias => {
            let game = new headToHeadGame({
                users: [req.body.user1, req.body.user2],
                status: 'open',
                points: [0, 0],
                currentQuestionIndex: 0,
                questions: []
            });
            for (triviaIndex in trivias){
                let curQuestion = {
                    triviaQuestion: {
                        question: trivias[triviaIndex].question,
                        answer: trivias[triviaIndex].answer,
                        options: trivias[triviaIndex].options
                    },
                    responses: [{},{}]
                }
                game.questions.push(curQuestion);
            }
            game.save().then(() => res.json({msg: 'Head-to-head gamse initialized'}))
                .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
        })
        .catch(err => res.status(500).json({msg: 'Internal service error', err: err}));
})

router.route('/test').post((req, res) => {
    console.log('test starts');

    initHeadToHeadGame('test1', 'test2');
    //initHeadToHeadGame('test3', 'test4');
    //initHeadToHeadGame('test5', 'test6');

    //test();

    console.log('test done');
    res.json({msg: 'done'});
});

module.exports = router;