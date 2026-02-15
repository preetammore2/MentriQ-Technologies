const express = require("express");
const router = express.Router();
const {
    getAllServices,
    getAdminServices,
    createService,
    updateService,
    deleteService,
    seedServices
} = require("../controllers/service.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

router.get("/", getAllServices); // Public - Active Only
router.get("/admin", protect, isAdmin, getAdminServices); // Admin - All
router.post("/seed", protect, isAdmin, seedServices);
router.post("/", protect, isAdmin, createService);
router.put("/:id", protect, isAdmin, updateService);
router.delete("/:id", protect, isAdmin, deleteService);

module.exports = router;
