const express = require("express");
const router = express.Router();
const {
    submitInquiry,
    getInquiries,
    markAsRead,
    deleteInquiry,
} = require("../controllers/contact.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

router.post("/", submitInquiry);
router.get("/", protect, isAdmin, getInquiries);
router.put("/:id/read", protect, isAdmin, markAsRead);
router.delete("/:id", protect, isAdmin, deleteInquiry);

module.exports = router;
