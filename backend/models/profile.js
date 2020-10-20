//Start every model with this line
const mongoose = require('mongoose');

//Create necessary schemas 
const Schema = mongoose.Schema;
const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  about: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  interest: {
    type: [String],
    required: false,
    unique: false,
    trim: true,
  },
  status: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  acsHistory: [{
    category: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],
  acsTotal: [{
    total: {
      type: Number,
      required: true,
      default: 0
    },
    triviaGamesPc: {
      type: Number,
      required: true,
      default: 0
    },
    analysisDebatePc: {
      type: Number,
      required: true,
      default: 0
    },
    picksPredicitonPc: {
      type: Number,
      required: true,
      default: 0
    },
    participationHistoryPc: {
      type: Number,
      required: true,
      default: 0
    }
  }]
  
}, {
  timestamps: true,
});
const profile = mongoose.model('profile', profileSchema);

//End every model with this line
module.exports = profile;