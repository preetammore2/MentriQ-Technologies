const express = require("express");
const router = express.Router();
const { getGlobalStats, updateGlobalStats, trackVisit } = require("../controllers/stats.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

router.get("/", getGlobalStats);
router.post("/track", trackVisit); // Public tracking
router.put("/", protect, isAdmin, updateGlobalStats);

module.exports = router;
