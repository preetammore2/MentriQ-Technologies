const mongoose = require("mongoose");

const internshipApplicationSchema = new mongoose.Schema(
    {
        internship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Internship",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // Snapshot of basic info at time of application
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },

        // Custom responses mapping to the questions in the Internship model
        responses: [
            {
                questionId: { type: String },
                label: { type: String },
                value: { type: mongoose.Schema.Types.Mixed }
            }
        ],

        status: {
            type: String,
            enum: ["Pending", "Shortlisted", "Selected", "Rejected"],
            default: "Pending"
        },
        resume: { type: String }, // URL to uploaded resume if any
        notes: { type: String } // Admin notes
    },
    { timestamps: true }
);

module.exports = mongoose.model("InternshipApplication", internshipApplicationSchema);
