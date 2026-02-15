const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, trim: true }, // e.g., "Student", "Web Developer"
        image: { type: String },
        message: { type: String, required: true, trim: true },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
