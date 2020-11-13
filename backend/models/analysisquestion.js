const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisQuestionSchema = new Schema({

    question: {
        type: String,
        unique: false,
        required: true,
    },
    tier: {
        type: String,
        unique: false,
        required: true,
        enum : ['Fanalyst', 'Analyst', 'Pro Analyst', 'Expert Analyst'],
    }

})

const analysisQuestion = mongoose.model('analysisQuestion', analysisQuestionSchema);
module.exports = analysisQuestion;