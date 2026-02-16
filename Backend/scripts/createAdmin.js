const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@mentriq.com";
        const password = "admin123"; // Simple password for initial access
        const name = "Super Admin";

        // Check if exists
        const existingUser = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (existingUser) {
            console.log(`User ${email} exists. Updating to Admin role and resetting password...`);
            existingUser.role = "admin";
            existingUser.password = hashedPassword;
            existingUser.name = name;
            await existingUser.save();
        } else {
            console.log(`Creating new Admin user: ${email}...`);
            await User.create({
                name,
                email,
                password: hashedPassword,
                role: "admin"
            });
        }

        console.log("-----------------------------------");
        console.log("ADMIN CREATED SUCCESSFULLY");
        console.log("Email: " + email);
        console.log("Password: " + password);
        console.log("-----------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
