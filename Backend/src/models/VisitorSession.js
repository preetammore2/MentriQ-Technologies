const mongoose = require("mongoose");

const visitorSessionSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true, unique: true },
        lastPath: { type: String },
        pathsVisited: [{ type: String }],
        lastActivity: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index to expire sessions after 30 minutes of inactivity
visitorSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model("VisitorSession", visitorSessionSchema);
