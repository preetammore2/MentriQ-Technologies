const mongoose = require('mongoose');
const Partner = require('./src/models/Partner');
const Technology = require('./src/models/Technology');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Partner.deleteMany({});
        await Technology.deleteMany({});
        console.log('Cleared existing data.');

        // Partners Data
        const partners = [
            { name: "HD Media Network", logo: "/images/hdmn.png" },
            { name: "SkyServer", logo: "/images/skyserver.jpg" },
            { name: "Singh Enterprises", logo: "/images/singh2.jpeg" },
            { name: "Falcons Beyond Imagination", logo: "/images/falcons.png" },
            { name: "Voltzenic Motors", logo: "/images/volt.png" },
            { name: "Ashok Infratech", logo: "/images/ashok.jpg" },
            { name: "Shekhawat Group of Industries", logo: "/images/shekhawat2.jpeg" },
            { name: "BIMPro Solutions pvt ltd", logo: "/images/bimpro2.jpeg" },
            { name: "Milan Power", logo: "/images/milanPower.png" },
            { name: "PU incent", logo: "/images/puIncent.png" },
            { name: "UPnex", logo: "/images/upnex2.jpeg" },
            { name: "NT Education", logo: "/images/nt2.jpeg" },
        ];

        // Technologies Data
        const technologies = [
            { name: "HTML", logo: "/images/html.png", color: "from-orange-500 to-red-500" },
            { name: "CSS", logo: "/images/css.png", color: "from-blue-500 to-cyan-500" },
            { name: "JavaScript", logo: "/images/js.png", color: "from-yellow-400 to-yellow-600" },
            { name: "React", logo: "/images/react.png", color: "from-cyan-400 to-blue-500" },
            { name: "Node.js", logo: "/images/Node.js_logo.svg.png", color: "from-green-500 to-emerald-600" },
            { name: "Express.js", logo: "/images/express3.webp", color: "from-yellow-200 to-yellow-100" },
            { name: "MongoDB", logo: "/images/mongodb4.png", color: "from-cyan-400 to-blue-500" },
            { name: "SQL", logo: "/images/sql.png", color: "from-indigo-500 to-purple-600" },
            { name: "Deveops", logo: "/images/deveops.svg", color: "from-orange-500 to-red-500" },
            { name: "Cyber Security", logo: "/images/security.png", color: "from-cyan-500 to-red-600" },
            { name: "Java", logo: "/images/java2.webp", color: "from-blue-500 to-cyan-500" },
            { name: "Blockchain", logo: "/images/blockchain.png", color: "from-purple-500 to-pink-500" },
            { name: "Flutter", logo: "/images/flutter5.png", color: "from-yellow-200 to-yellow-100" },
            { name: "Python", logo: "/images/python.png", color: "from-orange-500 to-red-600" },
            { name: "Data Analyst", logo: "/images/bigdata.png", color: "from-cyan-500 to-red-600" },
            { name: "Power BI", logo: "/images/powerBI.png", color: "from-yellow-500 to-red-600" },
        ];

        await Partner.insertMany(partners);
        await Technology.insertMany(technologies);

        console.log('✅ Partners and Technologies seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
