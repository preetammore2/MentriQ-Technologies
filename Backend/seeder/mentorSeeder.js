const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Mentor = require("../src/models/Mentor");
const connectDB = require("../src/config/db");

dotenv.config();

const mentors = [
    {
        name: "Litesh Singh", image: "/images/litesh.jpg", role: "Automation and DevOps", description: "5+ Years Experience in Automation and DevOps"
    },
    {
        name: "Jeevan Chauhan", image: "/images/jeevan.jpg", role: "Hybrid Applications", description: "5+ Years Experience in Hybrid Applications"
    },
    {
        name: "Yogesh Shekhawat", image: "/images/yogesh.jpg", role: "Product Management", description: "Product Management Expert"
    },
    {
        name: "Ram Swami", image: "/images/user.png", role: "Cyber Security", description: "Cyber Security Specialist"
    },
    {
        name: "Shubham Sharma", image: "/images/subhammentors.jpg", role: "Full Stack Developer", description: "Full Stack Developer"
    },
    {
        name: "Shiva Rama Krishna", image: "/images/sivaramakrishna.jpg", role: "Software Engineering", description: "Software Engineering Lead"
    },
    {
        name: "Lakhan Dadhich", image: "/images/lakhan.jpg", role: "Product Strategy", description: "Product Strategy"
    },
    {
        name: "Venkat Sai", image: "/images/venkatsai.jpg", role: "Operations", description: "Operations Expert"
    },
    {
        name: "Satya Narayan Pradhan", image: "/images/satyanarayan.jpg", role: "Integration Specialist", description: "Integration Specialist"
    },
    {
        name: "Hardik Sharma", image: "/images/hardik.jpg", role: "Cloud Solutions", description: "Cloud Solutions Architect"
    },
    {
        name: "Prince Jain", image: "/images/princejain.jpg", role: "Cyber Security", description: "Cyber Security Analyst"
    },
    {
        name: "Dharam Pal Singh", image: "/images/dharampalsingh.jpg", role: "Full Stack Developer", description: "Full Stack Developer"
    },
    {
        name: "Sameer Khan", image: "/images/sameer.jpg", role: "Full Stack Development", description: "Full Stack Development"
    },
];

const seedMentors = async () => {
    try {
        await connectDB();

        await Mentor.deleteMany();
        console.log("Mentors cleared");

        await Mentor.insertMany(mentors);
        console.log("Mentors imported");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedMentors();
