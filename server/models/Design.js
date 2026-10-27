const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    category: { type: String, required: true },
    src: { type: String, required: true },
    title: { type: String, required: true },
    caption: { type: String },
    size: { type: Number, default: 0 },
    dimensions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Design', designSchema);
