//Start every route with these lines - connects with model
const router = require('express').Router();
let analysis = require('../models/analysis');
let analysisPost = require('../models/analysispost');
let user = require('../models/user');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
const { findById } = require('../models/acs');

// request body: {_id: str, post: str}
//router.route('/').put(async (req, res) => {
router.route('/').put(passport.authenticate('jwt', { session: false }), async (req, res) => {
    //const username = req.body.username;
    const username = req.user.username;
    try {
        let cur_analysis = await analysis.findById({_id: req.body._id}).then(analysis => {return analysis});
        if(cur_analysis && cur_analysis.status == "open" && cur_analysis.users.includes(req.body.username) && req.body.post && req.body.post.length !== 0) {
            let cur_post = new analysisPost({
                analysis: cur_analysis,
                user: username,
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

//router.route('/:id/:username?').get((req, res) => {
router.route('/:id').get(passport.authenticate('jwt', { session: false }), (req, res) => {
    //const username = req.params.username;
    const username = req.user.username;
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
            if(cur_post.user == username) {
                user_posts.push(cur_post);
            } else {
                other_posts.push(cur_post);
            }
        }
        res.json({userPosts: user_posts, otherPosts: other_posts});
    }).catch(err => res.status(400).json({msg: "Bad request", err: err}));
});

//router.route('/random/:id/:limit').get((req, res) => {
router.route('/random/:id/:limit').get(passport.authenticate('jwt', { session: false }), (req, res) => {
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

module.exports = router;