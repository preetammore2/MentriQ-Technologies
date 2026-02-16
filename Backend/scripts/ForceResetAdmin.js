const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../src/models/User"); // Adjust path if needed
const connectDB = require("../src/config/db"); // Adjust path if needed

dotenv.config();

const resetAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@mentriqtechnologies.in";
        const password = "mentriq@123";

        console.log(`Resetting admin: ${email}`);

        let user = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!user) {
            user = await User.create({
                name: "Super Admin",
                email,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin created successfully.");
        } else {
            user.password = hashedPassword;
            user.role = "admin";
            user.name = "Super Admin"; // Ensure name is correct
            await user.save();
            console.log("Admin password forced updated successfully.");
        }

        console.log("-----------------------------------");
        console.log("Login with:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("-----------------------------------");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
