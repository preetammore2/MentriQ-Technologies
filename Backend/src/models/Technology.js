const mongoose = require("mongoose");

const technologySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
    },
    logo: {
        type: String,
        required: [true, "Please add a logo URL"]
    },
    category: {
        type: String,
        enum: ["frontend", "backend", "database", "devops", "cloud", "mobile", "other"],
        default: "other"
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Technology", technologySchema);
