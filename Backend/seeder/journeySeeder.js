const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Journey = require("../src/models/Journey");
const connectDB = require("../src/config/db");

dotenv.config();

const milestones = [
    {
        year: '2023',
        title: 'The Vision',
        description: 'MentriQ Technologies was conceived with a mission to bridge the gap between classroom learning and industry requirements.',
        order: 10
    },
    {
        year: '2024',
        title: 'Founding & Growth',
        description: 'Started our journey to skill students with cutting-edge tech. Successfully trained our first 500+ students with exceptional outcomes.',
        order: 20
    },
    {
        year: '2025',
        title: 'First Batch Impact',
        description: 'Launched several high-impact Developer bootcamps achieving a peak 95% placement rate within 3 months of completion.',
        order: 30
    },
    {
        year: '2026',
        title: 'Technological Scale',
        description: 'Expanded our curriculum to 50+ specialized courses, building a community of 2K+ highly skilled tech professional.',
        order: 40
    }
];

const seedJourney = async () => {
    try {
        await connectDB();

        await Journey.deleteMany();
        console.log("Journey milestones cleared");

        await Journey.insertMany(milestones);
        console.log("Journey milestones imported successfully");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedJourney();
