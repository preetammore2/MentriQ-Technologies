const express = require("express");
const router = express.Router();
const { getGlobalStats, updateGlobalStats } = require("../controllers/stats.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

router.get("/", getGlobalStats);
router.put("/", protect, isAdmin, updateGlobalStats);

module.exports = router;
