const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    applicationLink: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('JobPost', jobPostSchema);
