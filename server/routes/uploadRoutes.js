const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { upload: cloudinaryUpload } = require('../config/cloudinary');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${name}_${Date.now()}${ext}`);
    }
});

const localUpload = multer({ storage: storage });

// Toggle this between `cloudinaryUpload` and `localUpload` to debug Cloudinary issues.
// Cloudinary often throws "Request aborted" when the keys are wrong or missing.
const uploadMiddleware = cloudinaryUpload; // Or localUpload

// @desc    Upload single image to Cloudinary (or local)
// @route   POST /api/upload
// @access  Private (Admin only - middleware to be added)
router.post('/', (req, res, next) => {
    uploadMiddleware.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ 
                message: 'Upload failed: ' + err.message, 
                error: err.toString() 
            });
        }
        next();
    });
}, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        let fileUrl = req.file.path; // Default Cloudinary URL format
        
        // If we're using local storage for debugging, we rewrite the URL.
        if (uploadMiddleware === localUpload) {
             fileUrl = 'http://localhost:5000/uploads/' + req.file.filename;
        }

        // Try to get size in bytes (multer provides this)
        const fileSize = req.file.size || 0;
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            url: fileUrl,
            size: fileSize,
            dimensions: '' // Cloudinary standard doesn't return dimensions without Admin API or specific config, we'll leave empty or calculate frontend
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server Error during upload', error: error.message });
    }
});

module.exports = router;
