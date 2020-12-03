const router = require('express').Router();
let predictionPoints = require('../models/predictionPoints');
let profiles = require('../models/profile');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportConfig = require('../passport');
const { json } = require('express');

const divisions = [

  {max: 100, min: 90},
  {max: 89, min: 80},
  {max: 79, min: 70},
  {max: 69, min: 60},
  {max: 59, min: 50},
  {max: 49, min: 40},
  {max: 39, min: 30},
  {max: 29, min: 20},
  {max: 19, min: 10},
  {max: 9, min: 0}

]

async function returnGlobalLeaderboard(year, category, res){

  var divisionThreshhold = [0,0,0,0,0,0,0,0,0,0];
  var divisionCounts = [0,0,0,0,0,0,0,0,0,0];
  var divisionPercentage = [0,0,0,0,0,0,0,0,0,0];

  const totalUsers = (await predictionPoints.aggregate([{$match: {year: year, category: category}}, {$project: {total: {$size: "$userPoints"}}}]))[0].total
  
  divisions.forEach(async function(division, index){
    
    predictionPoints.aggregate([{$match: {year: year, category: category}}, 
                                {$project: {
                                  divisionCount: {
                                    $size: {
                                      $filter: {
                                        "input": "$userPoints", 
                                        "as": "userPoints", 
                                        "cond": {
                                          "$and":[
                                            {"$gte": ["$$userPoints.points", division.min]},
                                            {"$lte": ["$$userPoints.points", division.max]}
                                          ]
                                        }}}}}}])
    .then(async count => {

      divisionThreshhold[index] = division.max;
      divisionCounts[index] = count[0].divisionCount;
      divisionPercentage[index] = count[0].divisionCount / totalUsers * 100;

      if(index == divisions.length - 1){
        res.json( {
          divisionThreshhold: divisionThreshhold, 
          divisionCounts: divisionCounts, 
          divisionPercentage: divisionPercentage
        })
        
      }

    })

  });

}

function sortRadarRanking(user1, user2){
  
  if(user1.points > user2.points){
    return -1;
  }
  if(user1.points < user2.points){
    return 1;
  }
  return 0;
  
}

async function returnRadarLeaderboard(year, user, category, res){

  profiles.findOne({username: user})
  .then(userProfile => {
    console.log(userProfile.radarList)
    predictionPoints.findOne({year: year, category: category})
    .then(pp => {
      const radarUsers = pp.userPoints.filter(function (entry) {return (userProfile.radarList.includes(entry.user) || entry.user === user)});
      radarUsers.sort(sortRadarRanking);
      res.json(radarUsers)
    })
  })

}

router.route("/regularseason/global/:year").get(async(req, res) => {

  returnGlobalLeaderboard(req.params.year, "regularSeason", res);
  
});

router.route("/regularseason/radarlist/:year/:user").get((req, res) => {

  returnRadarLeaderboard(req.params.year, req.params.user, "regularSeason", res)

});

router.route("/playoff/global/:year").get((req, res) => {

  returnGlobalLeaderboard(req.params.year, "playoff", res);

});

router.route("/playoff/radarlist/:year/:user").get((req, res) => {

  returnRadarLeaderboard(req.params.year, req.params.user, "playoff", res)

});

router.route("/add/board").post((req, res) => {

  const year = req.body.year;
  const category = req.body.category;
  const userPoints = req.body.userPoints;

  predictionPoints.findOne({year: year, category: category})
  .then(found => {
    if(!found){
      const newPredictionPoints = new predictionPoints({
        year: year,
        category: category,
        userPoints: userPoints
      })

      newPredictionPoints.save()
        .then(() => {res.json("Document added")});

    } else {
      res.json("Document already exists")
    }

  })

});

router.route("/update").put((req, res) => {

  const year = req.body.year;
  const category = req.body.category;
  const user = req.body.user;
  const points = req.body.points;

  var options = {new: true, setDefaultsOnInsert: true, useFindAndModify: false};

  predictionPoints.findOneAndUpdate({year: req.body.year, category: req.body.category, userPoints: {$elemMatch: {user: user}}},
                                    {$inc: {"userPoints.$.points": points}},
                                    options)
  .then(pp => {
    if(!pp){

      const newUser = {
        user: user,
        points: points
      }

      predictionPoints.findOne({year: req.body.year, category: req.body.category})
      .then(pp2 => {
        pp2.userPoints.push(newUser);
        pp2.save().then(() => {res.json("Points updated")})
      })
    } else {
      res.json("Points updated")
    }
  })

});


module.exports = router;