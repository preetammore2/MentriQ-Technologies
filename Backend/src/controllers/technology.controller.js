const Technology = require("../models/Technology");

// @desc    Get all technologies
// @route   GET /api/technologies
// @access  Public
exports.getTechnologies = async (req, res) => {
    try {
        const technologies = await Technology.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: technologies.length,
            data: technologies
        });
    } catch (error) {
        console.error("GET TECHNOLOGIES ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// @desc    Create new technology
// @route   POST /api/technologies
// @access  Private/Admin
exports.createTechnology = async (req, res) => {
    try {
        const technology = await Technology.create(req.body);
        res.status(201).json({
            success: true,
            data: technology
        });
    } catch (error) {
        console.error("CREATE TECHNOLOGY ERROR:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// @desc    Update technology
// @route   PUT /api/technologies/:id
// @access  Private/Admin
exports.updateTechnology = async (req, res) => {
    try {
        let technology = await Technology.findById(req.params.id);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found"
            });
        }

        technology = await Technology.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: technology
        });
    } catch (error) {
        console.error("UPDATE TECHNOLOGY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// @desc    Delete technology
// @route   DELETE /api/technologies/:id
// @access  Private/Admin
exports.deleteTechnology = async (req, res) => {
    try {
        const technology = await Technology.findById(req.params.id);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found"
            });
        }

        await technology.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error("DELETE TECHNOLOGY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
