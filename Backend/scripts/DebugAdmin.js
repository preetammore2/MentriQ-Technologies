const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../src/models/User");
const connectDB = require("../src/config/db");

dotenv.config();

const debugAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@mentriqtechnologies.in";
        const password = "mentriq@123";

        console.log(`\n--- DEBUGGING ADMIN ACCOUNT: ${email} ---`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User NOT FOUND in database.");
        } else {
            console.log("✅ User FOUND.");
            console.log(`- ID: ${user._id}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Name: ${user.name}`);

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log("✅ Password 'mentriq@123' MATCHES the hash in DB.");
            } else {
                console.log("❌ Password 'mentriq@123' DOES NOT MATCH the hash.");

                // Fix it immediately
                console.log("... Attempting to fix password ...");
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
                console.log("✅ Password has been RESET to 'mentriq@123'.");
            }
        }

        console.log("-------------------------------------------\n");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugAdmin();
