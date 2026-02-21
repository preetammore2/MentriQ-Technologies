const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "moderator", "admin", "superadmin"], default: "student" },
    image: { type: String }, // User profile picture URL
    lastActiveAdmin: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
