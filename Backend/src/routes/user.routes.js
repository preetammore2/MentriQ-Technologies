const express = require("express");
const { getAllUsers, createUser, updateUserRole, deleteUser } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

// Only Admins can list and manage user roles
router.get("/", protect, isAdmin, getAllUsers);
router.post("/", protect, isAdmin, createUser);
router.put("/role/:id", protect, isAdmin, updateUserRole);
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
