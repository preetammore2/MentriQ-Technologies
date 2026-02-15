const Partner = require("../models/Partner");

const seedPartners = async (req, res) => {
    try {
        await Partner.deleteMany({});
        const partners = [
            { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", website: "https://google.com" },
            { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", website: "https://microsoft.com" },
            { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", website: "https://amazon.com" },
            { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", website: "https://www.tcs.com" },
            { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", website: "https://www.infosys.com" },
            { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", website: "https://www.wipro.com" },
            { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", website: "https://www.accenture.com" },
            { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", website: "https://www.ibm.com" },
            { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", website: "https://www.oracle.com" },
            { name: "HCLTech", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/HCL_Tech_logo_2022.svg", website: "https://www.hcltech.com" },
            { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", website: "https://meta.com" },
            { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", website: "https://netflix.com" },
            { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Adobe_Corporate_Logo.png", website: "https://www.adobe.com" },
            { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", website: "https://www.salesforce.com" },
            { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Intel_logo.svg", website: "https://www.intel.com" },
            { name: "AMD", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg", website: "https://www.amd.com" },
        ];
        await Partner.insertMany(partners);
        res.status(200).json({ message: "Partners seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createPartner = async (req, res) => {
    try {
        const partner = await Partner.create(req.body);
        res.status(201).json(partner);
    } catch (error) {
        res.status(400).json({ message: "Invalid Data" });
    }
};

const updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!partner) return res.status(404).json({ message: "Partner not found" });
        res.json(partner);
    } catch (error) {
        res.status(400).json({ message: "Update Failed" });
    }
};

const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) return res.status(404).json({ message: "Partner not found" });
        res.json({ message: "Partner Removed" });
    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
};

module.exports = {
    createPartner,
    getAllPartners,
    deletePartner,
    updatePartner,
    seedPartners
};
