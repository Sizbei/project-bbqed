const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Post = require('../models/post')
let Comment = require('../models/comment')
let Profile = require('../models/profile')

router.route('/display/:username/focused').get(async(req, res) => {
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
        let comments = await Comment.find({post: recentPosts[i]._id}, "commenter _id body likes upvoted downvoted").sort({'likes':'desc'}).limit(3).then((comment) => {
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

router.route('/display/:username/:post').get(async(req, res) => {
    let singlePost = await Post.findById(req.params.post).then(async (post) => {
        return post
    }).catch((err) => {res.status(400).json('Error ' + err)})
    let newComments = []
    let comments = await Comment.find({post: req.params.post}, "commenter _id body likes upvoted downvoted").sort({'likes':'desc', 'createdAt': 'desc'}).then((comment) => {
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
    let upvoted = singlePost.upvoted.includes(req.params.username)
    let downvoted = singlePost.downvoted.includes(req.params.username)
    let newPost = {}
    newPost._id = singlePost._id
    newPost.likes = singlePost.likes
    newPost.poster = singlePost.poster
    newPost.body = singlePost.body
    newPost.upvoted = upvoted
    newPost.downvoted = downvoted
    newPost.comments = newComments
    res.json({posts: newPost});
})

router.route('/addComment').post(async(req, res) => {
    const newComment = new Comment({
        commenter: req.body.commenter,
        post: req.body.post,
        likes: 0,
        upvoted: [],
        downvoted: []
    })
    newComment.save()
    .then(res.status(200).json("Created Comment"))
    .catch((err) => {res.status(400).json('Error: ' + err)})
})

router.route('/upvote').post(async(req, res) => {
    //Handle Comments
    if (req.body.comment.length != 0) {
        if (req.body.upvoted) {
            Comment.updateOne({_id: req.body.comment}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}})
            .then(res.status(200).json('Comment Upvoted - Removed'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            Comment.updateOne({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}})
            .then(res.status(200).json('Comment Upvoted - From Downvote'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            Comment.updateOne({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}})
            .then(res.status(200).json('Comment Upvoted - From Neutral'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    //Handle Post
    } else if (req.body.post.length != 0) {
        if (req.body.upvoted) {
            Post.updateOne({_id: req.body.post}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}})
            .then(res.status(200).json('Post Upvoted - Removed'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            Post.updateOne({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}})
            .then(res.status(200).json('Post Upvoted - From Downvote'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            Post.updateOne({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}})
            .then(res.status(200).json('Post Upvoted - From Neutral'))
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    }
})

// router.route('/:post/downvote').post()

module.exports = router;