const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

// @desc    Get all journey milestones
// @route   GET /api/journey
// @access  Public
router.get('/', async (req, res) => {
    try {
        const milestones = await Journey.find().sort({ order: 1, year: 1 });
        res.json(milestones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a journey milestone
// @route   POST /api/journey
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { year, title, description, order } = req.body;
        const milestone = new Journey({ year, title, description, order });
        const savedMilestone = await milestone.save();
        res.status(201).json(savedMilestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a journey milestone
// @route   PUT /api/journey/:id
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { year, title, description, order } = req.body;
        const updatedMilestone = await Journey.findByIdAndUpdate(
            req.params.id,
            { year, title, description, order },
            { new: true }
        );
        if (!updatedMilestone) {
            return res.status(404).json({ message: 'Milestone not found' });
        }
        res.json(updatedMilestone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a journey milestone
// @route   DELETE /api/journey/:id
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const milestone = await Journey.findByIdAndDelete(req.params.id);
        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found' });
        }
        res.json({ message: 'Milestone removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Seed journey milestones
// @route   POST /api/journey/seed
// @access  Private/Admin
router.post('/seed', protect, isAdmin, async (req, res) => {
    try {
        await Journey.deleteMany({});
        const milestones = [
            { year: "2018", title: "Inception", description: "MentriQ Technologies was founded with a vision to bridge the gap between academia and industry.", order: 1 },
            { year: "2019", title: "First Batch", description: "Successfully trained and placed our first batch of 50+ students in top MNCs.", order: 2 },
            { year: "2020", title: "Going Digital", description: "Launched our online learning platform, expanding our reach to students across the nation.", order: 3 },
            { year: "2021", title: "Partnerships", description: "Collaborated with 10+ major tech companies for direct hiring and internship opportunities.", order: 4 },
            { year: "2022", title: "Curriculum Upgrade", description: "Revamped our courses to include cutting-edge technologies like AI/ML and Blockchain.", order: 5 },
            { year: "2023", title: "Award Winning", description: "Recognized as the 'Best Tech Training Institute' by EdTech India.", order: 6 },
            { year: "2024", title: "Global Expansion", description: "Started training programs for international students and corporate clients.", order: 7 }
        ];
        await Journey.insertMany(milestones);
        res.status(200).json({ message: "Journey seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
