const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        image: { type: String, required: true }, // URL or path
        linkedin: { type: String, trim: true },
        description: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);
