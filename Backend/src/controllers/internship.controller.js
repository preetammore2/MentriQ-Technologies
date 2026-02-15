const Internship = require("../models/Internship");
const InternshipApplication = require("../models/InternshipApplication");

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getInternships = async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const internships = await Internship.find(filter).sort({ createdAt: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
const getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).json({ message: "Internship not found" });
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create internship
// @route   POST /api/internships
// @access  Admin
const createInternship = async (req, res) => {
    try {
        const internship = await Internship.create(req.body);
        res.status(201).json(internship);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "A partnership or internship with this slug already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Admin
const updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!internship) return res.status(404).json({ message: "Internship not found" });
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Admin
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).json({ message: "Internship not found" });
        await internship.deleteOne();
        res.json({ message: "Internship removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Submit application
// @route   POST /api/internships/apply
// @access  Public/Auth
const submitApplication = async (req, res) => {
    try {
        const { internshipId, responses, resume } = req.body;

        // In a real app, we'd get these from req.user
        // But since we want it like the course form, we might take them from body too 
        // or assume the user is logged in.
        const application = await InternshipApplication.create({
            internship: internshipId,
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            contact: req.user.phone || req.body.contact, // Fallback to body
            responses,
            resume
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/internships/applications
// @access  Admin
const getApplications = async (req, res) => {
    try {
        const { internshipId } = req.query;
        const filter = {};
        if (internshipId) filter.internship = internshipId;

        const applications = await InternshipApplication.find(filter)
            .populate("internship", "title company")
            .populate("user", "name email image")
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update application status
// @route   PUT /api/internships/applications/:id
// @access  Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const application = await InternshipApplication.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        if (status) application.status = status;
        if (notes) application.notes = notes;

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    submitApplication,
    getApplications,
    updateApplicationStatus
};
