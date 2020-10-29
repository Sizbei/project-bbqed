const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const triviaQuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        unique: false,
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        unique: false,
        trim: true,
    }
}, {
    timestamps: true,
});

const triviaQuestion = mongoose.model('triviaQuestion', triviaQuestionSchema);
module.exports = triviaQuestion;