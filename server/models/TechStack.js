const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true }, // class name (e.g., devicon-react-original) OR Cloudinary URL
    category: { type: String, required: true }, // e.g., 'Frontend', 'Backend', 'Database', 'Tools'
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TechStack', techStackSchema);
