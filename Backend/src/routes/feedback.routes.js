const express = require("express");
const { getFeedbacks, createFeedback, updateFeedback, deleteFeedback } = require("../controllers/feedback.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/", getFeedbacks);
router.post("/", protect, isAdmin, createFeedback);
router.put("/:id", protect, isAdmin, updateFeedback);
router.delete("/:id", protect, isAdmin, deleteFeedback);

// Seed route
router.post("/seed", protect, isAdmin, require("../controllers/feedback.controller").seedFeedbacks);

module.exports = router;
