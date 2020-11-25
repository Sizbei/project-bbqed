const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const playoffSchema = new Schema({
    user: {
      type: String,
    },
    year: {
      type: String,
    },
    predictions: {
      quarterfinals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'prediction'
      },
      semifinals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'prediction'
      },
      conferencefinals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'prediction'
      },
      finals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'prediction'
      },
    },
  }, {
    timestamps: true,
  });
const playoff = mongoose.model('playoff', playoffSchema);
module.exports = playoff;