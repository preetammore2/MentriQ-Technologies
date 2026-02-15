const JobPost = require("../models/JobPost");

const getJobPosts = async (req, res) => {
    try {
        const { type, location, isActive } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (location) filter.location = new RegExp(location, 'i');
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const jobs = await JobPost.find(filter).sort({ postedDate: -1 });
        return res.json(jobs);
    } catch (error) {
        console.error("Get job posts error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getJobPostById = async (req, res) => {
    try {
        const job = await JobPost.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job post not found" });
        return res.json(job);
    } catch (error) {
        console.error("Get job post by ID error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const createJobPost = async (req, res) => {
    try {
        const job = await JobPost.create(req.body);
        return res.status(201).json(job);
    } catch (error) {
        console.error("Create job post error:", error);
        return res.status(400).json({ message: error.message });
    }
};

const updateJobPost = async (req, res) => {
    try {
        const job = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ message: "Job post not found" });
        return res.json(job);
    } catch (error) {
        console.error("Update job post error:", error);
        return res.status(400).json({ message: error.message });
    }
};

const deleteJobPost = async (req, res) => {
    try {
        const job = await JobPost.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: "Job post not found" });
        return res.json({ message: "Job post deleted successfully" });
    } catch (error) {
        console.error("Delete job post error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const seedJobPosts = async (req, res) => {
    try {
        await JobPost.deleteMany({});
        const sampleJobs = [
            {
                title: "Frontend Developer",
                company: "TechNova Solutions",
                location: "Bangalore (Remote)",
                type: "Full-time",
                description: "We are looking for a skilled React developer with 1+ years of experience.",
                requirements: "React, Tailwind CSS, Redux, JavaScript",
                applicationLink: "https://example.com/apply/frontend",
                isActive: true
            },
            {
                title: "Backend Intern",
                company: "DataCloud Systems",
                location: "Hyderabad",
                type: "Internship",
                description: "Exciting opportunity for freshers to learn Node.js and MongoDB.",
                requirements: "Node.js basics, MongoDB, API development interest",
                applicationLink: "https://example.com/apply/backend-intern",
                isActive: true
            },
            {
                title: "UI/UX Designer",
                company: "Creative Pulse",
                location: "Mumbai",
                type: "Contract",
                description: "Looking for a creative mind to lead our new project design.",
                requirements: "Figma, Adobe XD, Prototyping, Design Systems",
                applicationLink: "https://example.com/apply/designer",
                isActive: true
            }
        ];
        const jobs = await JobPost.insertMany(sampleJobs);
        return res.status(201).json(jobs);
    } catch (error) {
        console.error("Seed job posts error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getJobPosts,
    getJobPostById,
    createJobPost,
    updateJobPost,
    deleteJobPost,
    seedJobPosts
};
