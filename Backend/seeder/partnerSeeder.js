const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Partner = require("../src/models/Partner");
const connectDB = require("../src/config/db");

dotenv.config();

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

const seedPartners = async () => {
    try {
        await connectDB();

        await Partner.deleteMany();
        console.log("Partners cleared");

        await Partner.insertMany(partners);
        console.log("Partners imported");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedPartners();
