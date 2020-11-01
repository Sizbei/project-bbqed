const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Post = require('../models/post')
let Comment = require('../models/comment')
let Profile = require('../models/profile')

router.route('/display/focused/:username').get(async(req, res) => {
    var radarList = await Profile.findOne({username: req.params.username}).then((user) => {
        return user.radarList;
    });
    var recentPosts = await Post.find({poster: {$in: radarList}}).sort({'createdAt':'desc'}).then((post) => {
        return post;
    })
    console.log(post);
});

router.route('/display/:username').get(async(req, res) => {
    let recentPosts = await Post.find({}, "likes _id poster body upvoted downvoted" ).sort({'createdAt':'desc'}).limit(10).then(async (post) => {
        return post
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newPostsList = []
    for (var i = 0; i < recentPosts.length; i++) {
        let newComments = []
        let comments = await Comment.find({recentPosts: recentPosts[i]._id}, "commenter _id body likes upvoted downvoted").sort({'likes':'desc'}).limit(3).then((comment) => {
            return comment;
        }).catch((err) => {res.status(400).json('Error ' + err)})
        for (var j = 0; j < comments.length; j++) {
            let newComment = {}
            newComment._id = comments[j]._id
            newComment.commenter = comments[j].commenter
            newComment.likes = comments[j].likes
            newComment.upvoted = comments[j].upvoted.includes(req.params.username);
            newComment.downvoted = comments[j].downvoted.includes(req.params.username);
            newComments[j] = newComment
        }
        let upvoted = recentPosts[i].upvoted.includes(req.params.username)
        let downvoted = recentPosts[i].downvoted.includes(req.params.username)
        let newPost = {}
        newPost._id = recentPosts[i]._id
        newPost.likes = recentPosts[i].likes
        newPost.poster = recentPosts[i].poster
        newPost.body = recentPosts[i].body
        newPost.upvoted = upvoted
        newPost.downvoted = downvoted
        newPost.comments = newComments
        newPostsList[i] = newPost
    }
    res.json({posts: newPostsList});
})

// router.route('display/focusedPost/:post').get()

// router.route('/:post/addComment').post()

// router.route('/:post/upvote').post()

// router.route('/:post/downvote').post()

// router.route('/:post/report')

// router.route('/:post/:comment/upvote).post()

module.exports = router;