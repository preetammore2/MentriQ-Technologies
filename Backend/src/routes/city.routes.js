const express = require('express');
const router = express.Router();
const {
    getCities,
    getAdminCities,
    createCity,
    updateCity,
    deleteCity
} = require('../controllers/city.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

router.route('/')
    .get(getCities)
    .post(protect, isAdmin, createCity);

router.get('/admin', protect, isAdmin, getAdminCities);

router.route('/:id')
    .put(protect, isAdmin, updateCity)
    .delete(protect, isAdmin, deleteCity);

module.exports = router;
