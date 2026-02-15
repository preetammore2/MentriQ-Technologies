const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Feedback = require("../src/models/Feedback");
const connectDB = require("../src/config/db");

dotenv.config();

const feedbacks = [
    {
        name: "Rakshit Chasta",
        message: "MentriQ helped me build real projects and crack my first job.",
        image: "/images/rakshit.jpeg",
        role: "Software Engineer",
        rating: 5,
        featured: true
    },
    {
        name: "Bhupendra Shekhawat",
        message: "Live classes and mentor support were outstanding.",
        image: "/images/bhupendra.jpg",
        role: "Full Stack Developer",
        rating: 5
    },
    {
        name: "Amit Naruka",
        message: "I gained confidence after completing hands-on projects.",
        image: "/images/amit.jpg",
        role: "Frontend Developer",
        rating: 5
    },
    {
        name: "Aryan Barot",
        message: "The course helped me understand core programming concepts in a very practical way.",
        image: "/images/barot.jpg",
        role: "Backend Engineer",
        rating: 5
    },
    {
        name: "Krishan Rajawat",
        message: "Hands-on projects made learning technology much easier and more interesting.",
        image: "/images/krishnarajawat.jpg",
        role: "Data Analyst",
        rating: 5
    },
    {
        name: "Bhanu Pratap",
        message: "The instructor explained complex topics like backend and databases very clearly.",
        image: "/images/bhanu2.jpeg",
        role: "System Engineer",
        rating: 5
    },
    {
        name: "Disha sharma",
        message: "Real-world examples helped me understand how tech is used in the industry.",
        image: "/images/disha3.jpeg",
        role: "UI/UX Designer",
        rating: 5
    },
    {
        name: "Saloni Choudhary",
        message: "The learning materials were up to date with current technologies.",
        image: "/images/saloni.jpg",
        role: "Web Developer",
        rating: 5
    },
    {
        name: "Garv Bhatiya",
        message: "I learned how frontend and backend work together in real applications.",
        image: "/images/garv.jpg",
        role: "Full Stack Developer",
        rating: 5
    },
    {
        name: "Vaibhav Sharma",
        message: "The course structure was well-organized and beginner-friendly.",
        image: "/images/vaibhav.jpg",
        role: "Software Developer",
        rating: 5
    },
];

const seedFeedbacks = async () => {
    try {
        await connectDB();

        await Feedback.deleteMany();
        console.log("Feedbacks cleared");

        await Feedback.insertMany(feedbacks);
        console.log("Feedbacks imported");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedFeedbacks();
