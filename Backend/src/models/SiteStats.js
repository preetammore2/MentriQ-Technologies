const mongoose = require("mongoose");

const siteStatsSchema = new mongoose.Schema(
  {
    students: { type: String, default: "" },
    courses: { type: String, default: "" },
    placements: { type: String, default: "" },
    trainers: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteStats", siteStatsSchema);

