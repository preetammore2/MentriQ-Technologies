const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const Mentor = require("../src/models/Mentor");

dotenv.config();

const mentors = [
    {
        name: "Litesh Singh", image: "/images/litesh.jpg", description: "5+ Years Experience in Automation and Deveops", role: "DevOps Engineer", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Jeevan Chauhan", image: "/images/jeevan.jpg", description: "5+ Years Experience in Hybrid Applications Development", role: "Hybrid App Developer", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Yogesh Shekhawat", image: "/images/yogesh.jpg", description: "2+ Years Experience in Entrepreneurship and Product Management", role: "Product Manager", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Ram Swami", image: "/images/user.png", description: "6+ Years Experience in Cyber Security", role: "Cyber Security Expert", stats: [
            { value: "6+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Shubham Sharma", image: "/images/subhammentors.jpg", description: "5+ years Experience in Full Stack Development", role: "Full Stack Developer", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Shiva Rama Krishna", image: "/images/sivaramakrishna.jpg", description: "8+ Years Experience in Software Engineering", role: "Software Engineer", stats: [
            { value: "8+", label: "Years" },
            { value: "20+", label: "Projects" }
        ]
    },
    {
        name: "Lakhan Dadhich", image: "/images/lakhan.jpg", description: "3+ Years Experience in Product Management", role: "Product Manager", stats: [
            { value: "3+", label: "Years" },
            { value: "7+", label: "Projects" }
        ]
    },
    {
        name: "Venkat Sai", image: "/images/venkatsai.jpg", description: "5+ Years Experience in Oprations Experts", role: "Operations Expert", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Satya Narayan Pradhan", image: "/images/satyanarayan.jpg", description: "5+ Years Experince in Integration Specialist", role: "Integration Specialist", stats: [
            { value: "5+", label: "Years" },
            { value: "20+", label: "Projects" }
        ]
    },
    {
        name: "Hardik Sharma", image: "/images/hardik.jpg", description: "2+ Years Experience in Cloud Technologies", role: "Cloud Engineer", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Prince Jain", image: "/images/princejain.jpg", description: "2+ Years Experience in Cyber Security ", role: "Cyber Security Analyst", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Dharam Pal Singh", image: "/images/dharampalsingh.jpg", description: "2+ Years Experience in Full Stack Development", role: "Full Stack Developer", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Pooja Bharia", image: "/images/poojabharia.jpg", description: "1+ Years Experience in Research Engineer", role: "Research Engineer", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Gaurav Sharma", image: "/images/gauravsharma.jpg", description: "1+ Years Experience in Cloud Technologies", role: "Cloud Engineer", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Pooja Yadav", image: "/images/poojayadav.jpg", description: "1+ Years Experience in Data Automation", role: "Data Automation Eng.", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Sameer Khan", image: "/images/sameer.jpg", description: "1+ Years Experience in Full Stack Development", role: "Full Stack Developer", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
];

const seedMentors = async () => {
    try {
        await connectDB();

        // Clear existing mentors
        await Mentor.deleteMany({});
        console.log("Cleared existing mentors");

        // Insert new mentors
        await Mentor.insertMany(mentors);
        console.log("SEEDING SUCCESS: All mentors added!");

        process.exit();
    } catch (error) {
        console.error("Error seeding mentors:", error);
        process.exit(1);
    }
};

seedMentors();
