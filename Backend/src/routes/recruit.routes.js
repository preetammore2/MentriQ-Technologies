const express = require('express');
const {
    createEnquiry,
    getEnquiries,
    getEnquiry,
    updateEnquiry,
    deleteEnquiry
} = require('../controllers/recruit.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .post(createEnquiry)
    .get(protect, authorize('admin', 'superadmin'), getEnquiries);

router.route('/:id')
    .get(protect, authorize('admin', 'superadmin'), getEnquiry)
    .put(protect, authorize('admin', 'superadmin'), updateEnquiry)
    .delete(protect, authorize('admin', 'superadmin'), deleteEnquiry);

module.exports = router;
