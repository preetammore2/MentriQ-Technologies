const Recruit = require('../models/Recruit');

// @desc    Create new recruit enquiry
// @route   POST /api/recruit
// @access  Public
exports.createEnquiry = async (req, res) => {
    try {
        const recruit = await Recruit.create(req.body);
        res.status(201).json({
            success: true,
            data: recruit
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get all recruit enquiries
// @route   GET /api/recruit
// @access  Private/Admin
exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Recruit.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single enquiry
// @route   GET /api/recruit/:id
// @access  Private/Admin
exports.getEnquiry = async (req, res) => {
    try {
        const enquiry = await Recruit.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }
        res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update enquiry status
// @route   PUT /api/recruit/:id
// @access  Private/Admin
exports.updateEnquiry = async (req, res) => {
    try {
        const enquiry = await Recruit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }
        res.status(200).json({
            success: true,
            data: enquiry
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Delete enquiry
// @route   DELETE /api/recruit/:id
// @access  Private/Admin
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Recruit.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
