const express = require("express");
const {
    getTechnologies,
    createTechnology,
    updateTechnology,
    deleteTechnology
} = require("../controllers/technology.controller");
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.route("/")
    .get(getTechnologies)
    .post(protect, isAdmin, createTechnology);

router.route("/:id")
    .put(protect, isAdmin, updateTechnology)
    .delete(protect, isAdmin, deleteTechnology);

module.exports = router;
