const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        logo: { type: String, required: true }, // URL or path
        website: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
