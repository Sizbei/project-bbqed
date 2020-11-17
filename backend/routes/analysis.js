//Start every route with these lines - connects with model
const router = require('express').Router();
let analysis = require('../models/analysis');
let analysisQuestion = require('../models/analysisquestion');
let acs = require('../models/acs');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
const { type } = require('jquery');

const acsTiers = {
    "Fanalyst": [0, 300],
    "Analyst": [300, 600],
    "Pro Analyst": [600, 900],
    "Expert Analyst": [900, 1100] 
}

const getTier = async (username) => {
    const acsScore = await acs.findOne({username : username}).then((cur_acs) => {
        if(cur_acs) {
            return cur_acs.acsTotal.total;
        }
        return -1;
    });
    let tier = null;
    for(curTier in acsTiers) {
        if (acsScore >= acsTiers[curTier][0] && acsScore < acsTiers[curTier][1]){
            tier = curTier;
            break;
        }
    }
    return tier
}

//const compareTime = (stopTime, curTime) => {
//    let hours = Math.floor((stopTime - curTime)/(1000*60*60));
//    let minutes = Math.floor((stopTime - curTime - hours*1000*60*60)/(1000*60)) + 1;
//    if(minutes == 60) {
//        hours += 1;
//        minutes = 0;
//    }
//    return hours + "h " + minutes + "m"
//}

const generateAnalysisResponse = (analysis) => {
    let response = {
        _id: analysis._id,
        question: analysis.question,
        tier: analysis.tier,
        status: analysis.status,
        endTime: analysis.endTime,
    }
    return response
}

//router.route('/current/:username').get(async (req, res) => {
router.route('/current').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    //const username = req.params.username;
    const username = req.user.username;
    try{
        const tier= await getTier(username);
        if (tier) {
            let response = {
                currentAcsTier: [],
                otherAcsTiers: [],
            }
            let curTierAnalyses = [];
            await analysis.find({status: "open"}).then(analyses => {
                for(index in analyses) {
                    if (analyses[index].tier == tier) {
                        curTierAnalyses.push(analyses[index]);
                    } else {
                        response.otherAcsTiers.push(generateAnalysisResponse(analyses[index]));
                    }
                }
                // check if user has been assigned with a analysis question
                if(curTierAnalyses[0].users.includes(username)) {
                    response.currentAcsTier.push(generateAnalysisResponse(curTierAnalyses[0]));
                    response.otherAcsTiers.push(generateAnalysisResponse(curTierAnalyses[1]));
                } else if (curTierAnalyses[1].users.includes(username)) {
                    response.currentAcsTier.push(generateAnalysisResponse(curTierAnalyses[1]));
                    response.otherAcsTiers.push(generateAnalysisResponse(curTierAnalyses[0]));
                } else {
                    // if not add user to one of the questions
                    if(curTierAnalyses[0].users.length <= curTierAnalyses[1].users.length) {
                        curTierAnalyses[0].users.push(username);
                        curTierAnalyses[0].save();
                        response.currentAcsTier.push(generateAnalysisResponse(curTierAnalyses[0]));
                        response.otherAcsTiers.push(generateAnalysisResponse(curTierAnalyses[1]));
                    } else {
                        curTierAnalyses[1].users.push(username);
                        curTierAnalyses[1].save();
                        response.currentAcsTier.push(generateAnalysisResponse(curTierAnalyses[1]));
                        response.otherAcsTiers.push(generateAnalysisResponse(curTierAnalyses[0]));
                    }
                }
            });
            res.json({analyses: response});
        } else {
            res.status(400).json({msg: "Bad request: invaild username in url."});
        }
    } catch(err) {
      res.status(500).json({msg: "Internal service error."});
    }
})

//router.route('/past/:start/:limit').get(async (req, res) => {
router.route('/past/:start/:limit').get(passport.authenticate('jwt', {session : false}), async (req, res) => {
    try {
        if(req.params.limit > 0 && req.params.start >= 0) {
            let response = [];
            await analysis.find({status: "close"}).sort({"startTime": "desc", "tier": "asc", "question": "asc"}).limit(parseInt(req.params.limit) + parseInt(req.params.start)).then(analyses => {
                for(let index = parseInt(req.params.start); index < analyses.length; index ++ ) {
                    response.push(generateAnalysisResponse(analyses[index]));
                }
            });
            res.json({analyses: response})
        } else {
            res.status(400).json({msg: "Bad request: incorect information in url"});
        }
    } catch(err) {
        res.status(500).json({msg: "Internal service error."});
    }
})

//router.route('/past/size').get((req, res) => {
router.route('/past/size').get(passport.authenticate('jwt', {session : false}), (req, res) => {
    analysis.find({status: "close"}).then(analyses => {
        res.json({size: analyses.length});
    }).catch(err => res.status(500).json({msg: "Internal service error.", err: err}));
})

//request body: {year, month, day, status}
router.route('/add').put((req, res) => {
    const analysis_count = 2;
    for(curTier in acsTiers) {
        for (let i = 1; i <= analysis_count; i++) {
            const a = new analysis({
                question: curTier + ": Question " + i + "-day " + req.body.day,
                status: req.body.status,
                tier: curTier,
                startTime: new Date(req.body.year, req.body.month, req.body.day),
                endTime: new Date(req.body.year, req.body.month, req.body.day + 1),
                users: [],
                responses: []
            });
            a.save();
        }
    }
    res.json("done");
})

module.exports = router;