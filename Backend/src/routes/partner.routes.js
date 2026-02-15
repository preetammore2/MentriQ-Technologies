const express = require("express");
const {
    createPartner,
    getAllPartners,
    deletePartner,
    updatePartner,
    seedPartners
} = require('../controllers/partner.controller');
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/", getAllPartners);
router.post("/", protect, isAdmin, createPartner);
router.put("/:id", protect, isAdmin, updatePartner);
router.delete("/:id", protect, isAdmin, deletePartner);


// Seed partners
router.post('/seed', protect, isAdmin, seedPartners);

module.exports = router;
