const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hdmixture_portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif', 'pdf'],
    resource_type: 'auto',
    public_id: (req, file) => {
        const path = require('path');
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
        return `${name}_${Date.now()}`;
    }
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
