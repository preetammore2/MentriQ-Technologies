const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        path: { type: String, required: true, unique: true },
        hits: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        exits: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
