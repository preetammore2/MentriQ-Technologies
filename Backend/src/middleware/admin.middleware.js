const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "moderator" || req.user.role === "superadmin")) {
    // Update last active timestamp
    await User.findByIdAndUpdate(req.user._id, { lastActiveAdmin: new Date() });
    next();
  } else {
    res.status(403).json({ message: "Staff access denied" });
  }
};

const isStaff = async (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "moderator" || req.user.role === "superadmin")) {
    // Update last active timestamp
    await User.findByIdAndUpdate(req.user._id, { lastActiveAdmin: new Date() });
    next();
  } else {
    res.status(403).json({ message: "Staff access denied" });
  }
};

module.exports = { isAdmin, isStaff };
