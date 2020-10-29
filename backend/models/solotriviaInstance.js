const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const soloTriviaInstanceSchema = new Schema({
    user: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0
    },
    questionIDs: {
      type: [ObjectId],
      required: true,
      default: []
    },
    times: {
      type: [Date],
      required: true,
      default: []
    },

  }, {
    timestamps: true,
  });
  
const soloTriviaInstance = mongoose.model('soloTriviaInstance', soloTriviaInstanceSchema);
module.exports = soloTriviaInstance;