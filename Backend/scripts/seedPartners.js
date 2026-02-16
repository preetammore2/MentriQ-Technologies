const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const Partner = require("../src/models/Partner");

dotenv.config();

const partners = [
    { name: "MongoDB", logo: "/images/mongodb.png", website: "https://www.mongodb.com" },
    { name: "React", logo: "/images/react.png", website: "https://react.dev" },
    { name: "Node.js", logo: "/images/node2.png", website: "https://nodejs.org" },
    { name: "Express", logo: "/images/Expressjs.png", website: "https://expressjs.com" },
    { name: "Python", logo: "/images/python.png", website: "https://www.python.org" },
    { name: "Java", logo: "/images/java.png", website: "https://www.java.com" },
    { name: "Flutter", logo: "/images/flutter.png", website: "https://flutter.dev" },
    { name: "Microsoft Power BI", logo: "/images/powerBI.png", website: "https://powerbi.microsoft.com" },
    { name: "Google Cloud", logo: "/images/bigdata.png", website: "https://cloud.google.com" },
    { name: "Blockchain Council", logo: "/images/blockchain.png", website: "https://www.blockchain-council.org" }
];

const seedPartners = async () => {
    try {
        await connectDB();

        // Clear existing partners
        await Partner.deleteMany({});
        console.log("Cleared existing partners");

        // Insert new partners
        await Partner.insertMany(partners);
        console.log("SEEDING SUCCESS: All partners added!");

        process.exit();
    } catch (error) {
        console.error("Error seeding partners:", error);
        process.exit(1);
    }
};

seedPartners();
