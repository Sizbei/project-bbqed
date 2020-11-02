const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
let Post = require('../models/post')
let Comment = require('../models/comment')
let Profile = require('../models/profile')
let Acs = require('../models/acs')

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
        let upvoted = recentPosts[i].upvoted.includes(req.params.username)
        let downvoted = recentPosts[i].downvoted.includes(req.params.username)
        let newPost = {}
        newPost._id = recentPosts[i]._id
        newPost.likes = recentPosts[i].likes
        newPost.poster.username = recentPosts[i].poster
        let image = await Profile.find({username: newPost.poster.username}, "image").then((user) => {
            return user.image
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newPost.poster.image = image;
        let acs = await Acs.find({username: newPost.poster.username}, 'acsTotal.total').then((acsobj) => {
            return acsobj.acsTotal.total
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newPost.poster.acs = acs
        newPost.body = recentPosts[i].body
        newPost.upvoted = upvoted
        newPost.downvoted = downvoted
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
        newComment.commenter.username = comments[j].commenter
        let image = await Profile.find({username: newComment.commenter.username}, "image").then((user) => {
            return user.image
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newComment.commenter.image = image
        let acs = await Acs.find({username: newComment.commenter.username}, 'acsTotal.total').then((acsobj) => {
            return acsobj.acsTotal.total
        }).catch((err) => {res.status(400).json('Error ' + err)})
        newComment.commenter.acs = acs
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
    newPost.poster.username = singlePost.poster
    let image = await Profile.find({username: newPost.poster.username}, "image").then((user) => {
        return user.image
    }).catch((err) => {res.status(400).json('Error ' + err)})
    newPost.poster.image = image;
    let acs = await Acs.find({username: newPost.poster.username}, 'acsTotal.total').then((acsobj) => {
        return acsobj.acsTotal.total
    }).catch((err) => {res.status(400).json('Error ' + err)})
    newPost.poster.acs = acs
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
    .then(async(comment) => {
        await Post.findByIdAndUpdate(req.body.post, {comments:{$push: comment.id}})
        .then(() => {res.status(200).json("Created Comment")})
        .catch((err) => {res.status(400).json('Error: ' + err)})
    })
    .catch((err) => {res.status(400).json('Error: ' + err)})
})

router.route('/upvote').put(async(req, res) => {
    //Handle Comments
    if (req.body.hasOwnProperty('comment') != 0) {
        if (req.body.upvoted) {
            await Comment.updateOne({_id: req.body.comment}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Comment.updateOne({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}})
            .then(() => {res.status(200).json({upvoted:true, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Comment.updateOne({_id: req.body.comment}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}})
            .then(() => {res.status(200).json({upvoted:true, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    //Handle Post
    } else if (req.body.hasOwnProperty('post') != 0) {
        if (req.body.upvoted) {
            await Post.updateOne({_id: req.body.post}, {$pull: {upvoted: req.body.username}, $inc: {likes: -1}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Post.updateOne({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 2}, $pull: {downvoted: req.body.username}})
            .then(() => {res.status(200).json({upvoted:true, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Post.updateOne({_id: req.body.post}, {$push: {upvoted: req.body.username}, $inc: {likes: 1}})
            .then(() => {res.status(200).json({upvoted:true, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    } else {
        res.status(400).json('Missing Post or Comment Id')
    }
})

router.route('/downvote').put(async(req, res) => {
    //Handle Comments
    if (req.body.hasOwnProperty('comment') != 0) {
        if (req.body.upvoted) {
            await Comment.updateOne({_id: req.body.comment}, {$pull: {upvoted: req.body.username}, $inc: {likes: -2}, $push:{downvote: req.body.username}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:true})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Comment.updateOne({_id: req.body.comment}, {$inc: {likes: 1}, $pull: {downvoted: req.body.username}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Comment.updateOne({_id: req.body.comment}, {$push: {downvoted: req.body.username}, $inc: {likes: -1}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:true})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    //Handle Post
    } else if (req.body.hasOwnProperty('post') != 0) {
        if (req.body.upvoted) {
            await Post.updateOne({_id: req.body.post}, {$pull: {upvoted: req.body.username}, $inc: {likes: -2}, $push:{downvote: req.body.username}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:true})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else if (req.body.downvoted) {
            await Post.updateOne({_id: req.body.post}, {$inc: {likes: 1}, $pull: {downvoted: req.body.username}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:false})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        } else {
            await Post.updateOne({_id: req.body.post}, {$push: {downvoted: req.body.username}, $inc: {likes: -1}})
            .then(() => {res.status(200).json({upvoted:false, downvoted:true})})
            .catch((err) => {
                res.status(400).json('Error: ' + err)
            })
        }
    } else {
        res.status(400).json('Missing Post or Comment Id')
    }
})

module.exports = router;