const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Check if Cloudinary credentials are properly configured
const hasCloudinary = (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'
);

let upload;
let useCloudinary = false;

if (hasCloudinary) {
    try {
        const cloudinary = require('../config/cloudinary');
        const { CloudinaryStorage } = require('multer-storage-cloudinary');

        const storage = new CloudinaryStorage({
            cloudinary,
            params: {
                folder: 'mentriq',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
        });

        upload = multer({
            storage,
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (/image\//.test(file.mimetype)) cb(null, true);
                else cb(new Error('Images only!'));
            },
        });

        useCloudinary = true;
        console.log('[Upload] Using Cloudinary storage');
    } catch (err) {
        console.warn('[Upload] Cloudinary setup failed, falling back to memory storage:', err.message);
    }
}

if (!useCloudinary) {
    // Use memory storage — return base64 data URL stored directly in MongoDB
    // This avoids ephemeral filesystem issues on Render
    upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (/image\//.test(file.mimetype)) cb(null, true);
            else cb(new Error('Images only!'));
        },
    });
    console.log('[Upload] Using in-memory storage (base64 output)');
}

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl;

    if (useCloudinary) {
        // Cloudinary returns the full https:// URL in req.file.path
        imageUrl = req.file.path;
    } else {
        // Convert buffer to base64 data URL — stored directly in MongoDB
        // No filesystem dependency, works on any hosting platform
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    res.json({ imageUrl });
});

module.exports = router;
