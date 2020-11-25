const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const predictionSchema = new Schema({
    team1: {
      type: String,
    },
    team2: {
      type: String,
    },
    prediction: {
      type: String,
    },
    gameDay: {
      type: String,
    },
    gameCategory: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['regularSeason', 'playoff'],
    }
  }, {
    timestamps: true,
  });
const prediction = mongoose.model('prediction', predictionSchema);
module.exports = prediction;