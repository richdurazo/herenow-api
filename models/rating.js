const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    rating: {
        type: number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    counselor: {
        type: Schema.Types.ObjectId,
        ref: 'Counselor'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', ratingSchema)