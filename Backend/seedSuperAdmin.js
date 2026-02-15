const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const dotenv = require("dotenv");

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");

        const email = process.env.SUPER_ADMIN_EMAIL || "admin@mentriqtechnologies.in";
        const password = process.env.SUPER_ADMIN_PASSWORD || "mentriq@123";
        const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Super Admin already exists. Updating role...");
            userExists.role = "admin";
            const salt = await bcrypt.genSalt(10);
            userExists.password = await bcrypt.hash(password, salt);
            await userExists.save();
            console.log("Super Admin updated successfully.");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name,
                email: email,
                password: hashedPassword,
                role: "admin"
            });
            console.log("Super Admin created successfully.");
        }

        process.exit();
    } catch (error) {
        console.error("SEEDER ERROR", error);
        process.exit(1);
    }
};

seedSuperAdmin();
