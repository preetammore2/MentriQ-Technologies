const express = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  seedCourses
} = require("../controllers/course.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();


router.get("/", getCourses);
router.get("/:id", getCourseById);


router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);




router.post("/seed", protect, isAdmin, seedCourses);

module.exports = router;