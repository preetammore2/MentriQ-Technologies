const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@mentriqtechnologies.com' });
    if (adminExists) {
      console.log('Admin user exists, removing...');
      await User.deleteOne({ email: 'admin@mentriqtechnologies.com' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);

    const adminUser = await User.create({
      name: 'MentriQ Admin',
      email: 'admin@mentriqtechnologies.com',
      password: hashedPassword,
      role: 'admin',
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(createAdmin);
