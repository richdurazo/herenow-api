const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const counselorSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        required: true
    },
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
    },
    certifications: {
        type: [String]
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('Counselor', counselorSchema);