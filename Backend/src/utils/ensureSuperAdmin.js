const bcrypt = require("bcryptjs");
const User = require("../models/User");

const SUPER_ADMIN_EMAIL = String(process.env.SUPER_ADMIN_EMAIL || "admin@mentriqtechnologies.in").trim().toLowerCase();
const SUPER_ADMIN_PASSWORD = String(process.env.SUPER_ADMIN_PASSWORD || "mentriq@123").trim();
const SUPER_ADMIN_NAME = String(process.env.SUPER_ADMIN_NAME || "Super Admin").trim();

const ensureSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
      await User.create({
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Super Admin created");
    } else {
      // TROUBLESHOOTING: Ensure the password matches the env variable if it exists
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      console.log("Super Admin synchronized (Password/Role reset for troubleshooting)");
    }
  } catch (error) {
    console.error("Failed to ensure super admin:", error.message);
    // Don't throw logic error to prevent crash, just log it
  }
};

module.exports = ensureSuperAdmin;
