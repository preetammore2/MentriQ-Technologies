const User = require("../models/User");
const Course = require("../models/Course");
const Partner = require("../models/Partner");
const SiteStats = require("../models/SiteStats");
const Enrollment = require("../models/Enrollment");

// @desc    Get global statistics for public site
// @route   GET /api/stats
// @access  Public
const getGlobalStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: "student" });
        const courseCount = await Course.countDocuments({ isActive: true });
        const partnerCount = await Partner.countDocuments();
        const enrolledUserIds = await Enrollment.distinct("user");
        const enrolledStudentCount = await User.countDocuments({
            _id: { $in: enrolledUserIds },
            role: "student"
        });

        const statsConfig = await SiteStats.findOne().lean();
        const defaultStudents = `${enrolledStudentCount > 2000 ? enrolledStudentCount : "2K+"}`;
        const defaultCourses = `${courseCount > 50 ? courseCount : "50+"}`;
        const defaultPlacements = "98%";
        const defaultTrainers = "60+";

        res.json({
            students: statsConfig?.students || defaultStudents,
            courses: statsConfig?.courses || defaultCourses,
            placements: statsConfig?.placements || defaultPlacements,
            trainers: statsConfig?.trainers || defaultTrainers,
            raw: {
                enrolledStudents: enrolledStudentCount,
                students: studentCount,
                courses: courseCount,
                partners: partnerCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update public stats display values
// @route   PUT /api/stats
// @access  Private/Staff
const updateGlobalStats = async (req, res) => {
    try {
        const { students, courses, placements, trainers } = req.body;

        const payload = {
            students: String(students || "").trim(),
            courses: String(courses || "").trim(),
            placements: String(placements || "").trim(),
            trainers: String(trainers || "").trim(),
            updatedBy: req.user?._id
        };

        if (!payload.students || !payload.courses || !payload.placements || !payload.trainers) {
            return res.status(400).json({ message: "All stats fields are required" });
        }

        const existing = await SiteStats.findOne();
        let saved;

        if (existing) {
            saved = await SiteStats.findByIdAndUpdate(existing._id, payload, { new: true });
        } else {
            saved = await SiteStats.create(payload);
        }

        return res.json({
            message: "Stats updated successfully",
            stats: {
                students: saved.students,
                courses: saved.courses,
                placements: saved.placements,
                trainers: saved.trainers
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getGlobalStats,
    updateGlobalStats,
};
