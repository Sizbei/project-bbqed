const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const triviaInstanceSchema = new Schema({
    user1: {
      type: String,
      required: true,
      trim: true,
    },
    user2: {
      type: String,
      required: false,
      trim: true,
    },
    points1: {
      type: Number,
      required: true,
      default: 0
    },
    points2: {
      type: Number,
      required: false,
      default: 0
    },
    questionCount: {
      type: Number,
      required: true,
      default: 0
    },
    elapsedTime: {
      type: Number,
      required: true,
      default: 0
    },

  }, {
    timestamps: true,
  });
const triviaInstance = mongoose.model('triviaInstance', triviaInstanceSchema);
module.exports = triviaInstance;