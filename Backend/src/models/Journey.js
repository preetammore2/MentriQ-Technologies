const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    year: {
        type: String,
        required: [true, 'Year is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Journey', journeySchema);
