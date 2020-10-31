const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const headToHeadGameSchema = new Schema({
    users: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum : ['open','close'],
        required: true,
    },
    points: {
        type: [Number],
        required: true,
    },
    currentQuestionIndex: {
        type: Number,
        required: true
    },
    questions: [
        {
            triviaQuestion: {
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
            },
            responses: [
                {
                    answer: {
                        type: String,
                        required: false,
                    },
                    responseTime: {
                        type: Date,
                        required: false,
                    }
                }
            ],
            startTime: {
                type: Date,
                required: false,
            },
        },
    ]
}, {
    timestamps: true,
});

const headToHeadGame = mongoose.model('headToHeadGame', headToHeadGameSchema);
module.exports = headToHeadGame;