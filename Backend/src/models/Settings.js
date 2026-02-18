const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    email: { type: String, trim: true, default: "support@mentriqtechnologies.in" },
    phone: { type: String, trim: true, default: "+918890301264" },
    address: { type: String, trim: true, default: "MentriQ Technologies, Sector 3, Jaipur" },
    mapLink: { type: String, trim: true, default: "" },
    socialLinks: {
        instagram: { type: String, trim: true, default: "" },
        linkedin: { type: String, trim: true, default: "" },
        twitter: { type: String, trim: true, default: "" },
        whatsapp: { type: String, trim: true, default: "" }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
