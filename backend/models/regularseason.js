const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const regularSeasonSchema = new Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'game',
    },
    status: {
        type: String,
        unique: false,
        required: true,
        enum : ['open','close','waitForAcs']
    },
    predictions: [
        {
            user: {
                type: String,
                unique: false,
                required: true,
            },
            pick: {
                type: String,
                unique: false,
                required: true,
            }
        }
    ]
}, {
    timestamps: true,
});

const regularSeason = mongoose.model('regularSeason', regularSeasonSchema);
module.exports = regularSeason;