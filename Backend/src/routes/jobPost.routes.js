const express = require("express");
const router = express.Router();
const jobPostController = require("../controllers/jobPost.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

// Public routes
router.get("/", jobPostController.getJobPosts);
router.get("/:id", jobPostController.getJobPostById);

// Admin routes
router.post("/", protect, isAdmin, jobPostController.createJobPost);
router.put("/:id", protect, isAdmin, jobPostController.updateJobPost);
router.delete("/:id", protect, isAdmin, jobPostController.deleteJobPost);
router.post("/seed", protect, isAdmin, jobPostController.seedJobPosts);

module.exports = router;
