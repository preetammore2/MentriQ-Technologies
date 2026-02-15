const Mentor = require("../models/Mentor");

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeMentorPayload = (body = {}, { partial = false } = {}) => {
    const payload = {};

    const name = cleanString(body.name);
    const role = cleanString(body.role);
    const image = cleanString(body.image || body.imageUrl);
    const linkedin = cleanString(body.linkedin || body.linkedinUrl);
    const description = cleanString(body.description || body.bio);

    if (!partial || body.name !== undefined) payload.name = name;
    if (!partial || body.role !== undefined) payload.role = role;
    if (!partial || body.image !== undefined || body.imageUrl !== undefined) payload.image = image;
    if (!partial || body.linkedin !== undefined || body.linkedinUrl !== undefined) payload.linkedin = linkedin;
    if (!partial || body.description !== undefined || body.bio !== undefined) payload.description = description;

    return payload;
};

const getMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().sort({ createdAt: -1 });
        const withAliases = mentors.map((mentor) => {
            const obj = mentor.toObject();
            return {
                ...obj,
                imageUrl: obj.image || "",
                linkedinUrl: obj.linkedin || "",
                bio: obj.description || "",
            };
        });
        res.json(withAliases);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createMentor = async (req, res) => {
    try {
        const payload = normalizeMentorPayload(req.body);
        const mentor = await Mentor.create(payload);
        res.status(201).json(mentor);
    } catch (error) {
        res.status(400).json({ message: "Invalid Data" });
    }
};

const updateMentor = async (req, res) => {
    try {
        const payload = normalizeMentorPayload(req.body, { partial: true });
        const mentor = await Mentor.findByIdAndUpdate(req.params.id, payload, {
            new: true,
        });
        if (!mentor) return res.status(404).json({ message: "Mentor not found" });
        res.json(mentor);
    } catch (error) {
        res.status(400).json({ message: "Update Failed" });
    }
};

const deleteMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findByIdAndDelete(req.params.id);
        if (!mentor) return res.status(404).json({ message: "Mentor not found" });
        res.json({ message: "Mentor Removed" });
    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
};

const seedMentors = async (req, res) => {
    try {
        await Mentor.deleteMany({});
        const mentors = [
            {
                name: "Sundar Pichai",
                role: "CEO",
                company: "Google",
                bio: "Chief Executive Officer of Alphabet and Google.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Sundar_pichai.png",
                linkedinUrl: "https://www.linkedin.com/in/sundarpichai/"
            },
            {
                name: "Satya Nadella",
                role: "CEO",
                company: "Microsoft",
                bio: "Chairman and CEO of Microsoft. Before becoming CEO, he was the executive vice president of Microsoft's cloud and enterprise group.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg",
                linkedinUrl: "https://www.linkedin.com/in/satyanadella/"
            },
            {
                name: "Shantanu Narayen",
                role: "CEO",
                company: "Adobe",
                bio: "Chairman, President, and Chief Executive Officer of Adobe Inc.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Shantanu_Narayen_WEF_2019.jpg",
                linkedinUrl: "https://www.linkedin.com/in/shantanu-narayen-b346761/"
            },
            {
                name: "Arvind Krishna",
                role: "CEO",
                company: "IBM",
                bio: "Chairman and CEO of IBM. He began his career at IBM in 1990, at IBM's Thomas J. Watson Research Center.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Arvind_Krishna_WEF_2023.jpg",
                linkedinUrl: "https://www.linkedin.com/in/arvindkrishna/"
            },
            {
                name: "Neal Mohan",
                role: "CEO",
                company: "YouTube",
                bio: "Chief Executive Officer of YouTube. He was previously the Chief Product Officer at YouTube.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Neal_Mohan_2023.jpg",
                linkedinUrl: "https://www.linkedin.com/in/nealmohan/"
            },
            {
                name: "Anjali Sud",
                role: "CEO",
                company: "Tubi",
                bio: "Chief Executive Officer of Tubi. She was previously the CEO of Vimeo.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Anjali_Sud_at_Internet_Week_HQ.jpg",
                linkedinUrl: "https://www.linkedin.com/in/anjalisud/"
            },
            {
                name: "Jayshree Ullal",
                role: "CEO",
                company: "Arista Networks",
                bio: "President and CEO of Arista Networks. She was named one of Barron's 'World's Best CEOs' in 2018.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Jayshree_Ullal.jpg",
                linkedinUrl: "https://www.linkedin.com/in/jayshreeullal/"
            },
            {
                name: "Revathi Advaithi",
                role: "CEO",
                company: "Flex",
                bio: "Chief Executive Officer of Flex. She is an advocate for women in STEM and workforce diversity.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Revathi_Advaithi.jpg",
                linkedinUrl: "https://www.linkedin.com/in/revathiadvaithi/"
            },
            {
                name: "Tim Cook",
                role: "CEO",
                company: "Apple",
                bio: "Chief Executive Officer of Apple Inc. previously served as the company's chief operating officer under its co-founder Steve Jobs.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Tim_Cook_2009_cropped.jpg",
                linkedinUrl: "https://www.twitter.com/tim_cook"
            },
            {
                name: "Lisa Su",
                role: "CEO",
                company: "AMD",
                bio: "President and Chief Executive Officer of Advanced Micro Devices (AMD). She is known for her work developing silicon-on-insulator semiconductor manufacturing technologies.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Lisa_Su_computex_2019_%28cropped%29.jpg",
                linkedinUrl: "https://www.linkedin.com/in/lisa-su-amd/"
            },
            {
                name: "Jensen Huang",
                role: "CEO",
                company: "NVIDIA",
                bio: "Co-founder, President and CEO of NVIDIA Corporation. He co-founded the company in 1993 at age 30 and has been its president and CEO since.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jensen_Huang_%28cropped%29.jpg",
                linkedinUrl: "https://www.linkedin.com/in/jenhsunhuang/"
            },
            {
                name: "Sheryl Sandberg",
                role: "Former COO",
                company: "Meta",
                bio: "American technology executive, philanthropist, and writer. She served as the Chief Operating Officer (COO) of Meta Platforms.",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Sheryl_Sandberg_2017.jpg",
                linkedinUrl: "https://www.linkedin.com/in/sheryl-sandberg-5126652/"
            }
        ];
        const normalizedMentors = mentors.map((mentor) => normalizeMentorPayload(mentor));
        await Mentor.insertMany(normalizedMentors);
        res.status(200).json({ message: "Mentors seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMentors, createMentor, updateMentor, deleteMentor, seedMentors };
