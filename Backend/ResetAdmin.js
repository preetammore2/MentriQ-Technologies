const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@mentriqtechnologies.in';
        const password = 'mentriq@123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                role: 'admin',
                name: 'Super Admin'
            },
            { upsert: true, new: true }
        );

        console.log('Admin User Reset Successfully:');
        console.log('Email:', user.email);
        console.log('Password:', password);
        console.log('Role:', user.role);
        console.log('ID:', user._id);

        process.exit();
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
