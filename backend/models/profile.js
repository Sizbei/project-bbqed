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
    type: String,
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
  acs: {
    type: Number,
    default: 0,
    required: true,
    unique: false,
    trim: true,
  },
}, {
  timestamps: true,
});
const profile = mongoose.model('profile', profileSchema);

//End every model with this line
module.exports = profile;