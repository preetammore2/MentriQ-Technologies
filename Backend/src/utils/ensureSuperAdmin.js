const bcrypt = require("bcryptjs");
const User = require("../models/User");

const SUPER_ADMIN_EMAIL = String(process.env.SUPER_ADMIN_EMAIL || "admin@mentriqtechnologies.in").trim().toLowerCase();
const SUPER_ADMIN_PASSWORD = String(process.env.SUPER_ADMIN_PASSWORD || "mentriq@123").trim();
const SUPER_ADMIN_NAME = String(process.env.SUPER_ADMIN_NAME || "Super Admin").trim();

const ensureSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ email: SUPER_ADMIN_EMAIL });
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    if (!existing) {
      await User.create({
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Super Admin created");
      return;
    }

    let shouldSave = false;

    if (existing.role !== "admin") {
      existing.role = "admin";
      shouldSave = true;
    }

    if (existing.name !== SUPER_ADMIN_NAME) {
      existing.name = SUPER_ADMIN_NAME;
      shouldSave = true;
    }

    const passwordMatches = await bcrypt.compare(SUPER_ADMIN_PASSWORD, existing.password);
    if (!passwordMatches) {
      existing.password = hashedPassword;
      shouldSave = true;
    }

    if (shouldSave) {
      await existing.save();
      console.log("Super Admin updated");
    }
  } catch (error) {
    console.error("Failed to ensure super admin:", error.message);
    throw error;
  }
};

module.exports = ensureSuperAdmin;
