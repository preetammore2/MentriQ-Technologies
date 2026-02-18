const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'mentriq', // All uploads go into the 'mentriq' folder on Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif|svg/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = /image\//.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// POST /api/upload — returns { imageUrl: "https://res.cloudinary.com/..." }
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Cloudinary returns the secure URL in req.file.path
    res.json({ imageUrl: req.file.path });
});

module.exports = router;
