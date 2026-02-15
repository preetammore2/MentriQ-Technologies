const express = require("express");
const { getMentors, createMentor, updateMentor, deleteMentor } = require("../controllers/mentor.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/", getMentors);
router.post("/", protect, isAdmin, createMentor);
router.put("/:id", protect, isAdmin, updateMentor);
router.delete("/:id", protect, isAdmin, deleteMentor);

// Seed route
router.post("/seed", protect, isAdmin, require("../controllers/mentor.controller").seedMentors);

module.exports = router;
