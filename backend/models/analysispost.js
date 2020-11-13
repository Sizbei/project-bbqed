const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisPostSchema = new Schema({

    analysis: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'analysis'
    },
    user: {
        type: String,
        unique: false,
        required: true,
    },
    response: {
        type: String,
        unique: false,
        required: true,
    },

},{
    timestamps: true,
})

const analysisPost = mongoose.model('analysisPost', analysisPostSchema);
module.exports = analysisPost;