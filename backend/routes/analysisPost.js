//Start every route with these lines - connects with model
const router = require('express').Router();
let analysis = require('../models/analysis');
let analysisPost = require('../models/analysispost');
let user = require('../models/user');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');

// request body: {_id: str, username: str, post: str}
router.route('/').put(async (req, res) => {
//router.route('/').put(passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let cur_analysis = await analysis.findById({_id: req.body._id}).then(analysis => {return analysis});
        const cur_user = await user.findOne({username: req.body.username}).then(user => {return user});
        if(cur_analysis && cur_analysis.status == "open" && cur_user && cur_analysis.users.includes(req.body.username) && req.body.post && req.body.post.length !== 0) {
            let cur_post = new analysisPost({
                analysis: cur_analysis,
                user: req.body.username,
                response: req.body.post,
                averageScore: 0,
                scoreCount: 0,
                scoreCounts: [],
                scoreHistory: []
            });
            for(let i = 0; i <= 100; i++) {
                cur_post.scoreCounts.push(0);
            }
            cur_post.save();
            cur_analysis.responses.push(cur_post);
            cur_analysis.save();
            res.json({msg: "Post is saved."})
        } else {
            res.status(400).json({msg: "Bad request: request body contains incorrect information."});
        }
    } catch(err) {
        res.status(400).json({msg: "Bas request"})
    }
});

router.route('/:id/:username?').get((req, res) => {
    analysisPost.find({analysis: req.params.id}).sort({"createdAt": "desc"}).then(posts => {
        let user_posts = [];
        let other_posts = [];
        for(index in posts) {
            const cur_post = {
                _id: posts[index]._id,
                user: posts[index].user,
                content: posts[index].response,
                averageScore: posts[index].averageScore
            }
            if(cur_post.user == req.params.username) {
                user_posts.push(cur_post);
            } else {
                other_posts.push(cur_post);
            }
        }
        res.json({userPosts: user_posts, otherPosts: other_posts});
    }).catch(err => res.status(400).json({msg: "Bad request", err: err}));
});

router.route('/random/:id/:limit').get(async (req, res) => {
    analysisPost.find({analysis: req.params.id}).sort({"scoreCount": "asc", "createdAt": "asc"}).limit(parseInt(req.params.limit)).then(posts => {
        let random_posts = [];
        for(index in posts) {
            const cur_post = {
                _id: posts[index]._id,
                user: posts[index].user,
                content: posts[index].response,
                averageScore: posts[index].averageScore
            }
            random_posts.push(cur_post);
        }
        res.json({posts: random_posts});
    }).catch(err => res.status(400).json({msg: "Bad request", err: err}));
});

const findScoreHistory = (username, score_history) => {
    for(index in score_history) {
        if(score_history[index].user == username) {
            return index;
        }
    }
    return null;
}

// request body: {_id: str, score: int}
//router.route('/score').put(async (req, res) => {
router.route('/').put(passport.authenticate('jwt', { session: false }), async (req, res) => {
    const username = req.user.username;
    //const username = req.body.username;
    let cur_post = await analysisPost.findById({_id: req.body._id}).then(post => {return post})
        .catch(err => res.status(400).json({msg: "Bad request", err: err}));
    if(cur_post && req.body.score >= 0 && req.body.score <=100 && Number.isInteger(req.body.score)) {
        let cur_analysis = await analysis.findById({_id: cur_post.analysis}).then(analysis => {return analysis})
            .catch(err => res.status(500).json({msg: "Internal service err", err: err}));
        if(cur_post.user != username && cur_analysis.users.includes(username)) {
            let cur_score_index = findScoreHistory(username, cur_post.scoreHistory);
            if(cur_score_index) {
                const init_score = cur_post.scoreHistory[cur_score_index].score;
                cur_post.scoreHistory[cur_score_index].score = req.body.score;
                cur_post.averageScore = (cur_post.averageScore * cur_post.scoreCount + req.body.score - init_score)/(cur_post.scoreCount);
                cur_post.scoreCounts.set(req.body.score, cur_post.scoreCounts[req.body.score] + 1);
                cur_post.scoreCounts.set(init_score, cur_post.scoreCounts[init_score] - 1);
            } else {
                const new_score = {
                    user: username,
                    score: req.body.score
                }
                cur_post.scoreHistory.push(new_score);
                cur_post.averageScore = (cur_post.averageScore * cur_post.scoreCount + req.body.score)/(cur_post.scoreCount + 1);
                cur_post.scoreCount += 1;
                cur_post.scoreCounts.set(req.body.score, cur_post.scoreCounts[req.body.score] + 1);
            }
            cur_post.save().then(res.json({msg: "Score is posted."}))
                .catch(err => res.status(500).json({msg: "Internal service err", err: err}))
        } else {
            res.status(400).json({msg: "Bad request: current user cannot score this post"});
        }
    } else {
        res.status(400).json({msg: "Bad request: request body contain incorrect information."});
    }
});

module.exports = router;