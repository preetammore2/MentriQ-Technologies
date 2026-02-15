const express = require("express");
const {
  enrollInCourse,
  getMyEnrollments,
  getAllEnrollments,
  updateEnrollment,
  deleteEnrollment
} = require("../controllers/enrollment.controller");

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/", protect, enrollInCourse);
router.get("/my", protect, getMyEnrollments);
router.get("/", protect, isAdmin, getAllEnrollments);
router.put("/:id", protect, isAdmin, updateEnrollment);
router.delete("/:id", protect, isAdmin, deleteEnrollment);

module.exports = router;
