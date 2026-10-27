const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    quote: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    src: { type: String }, // image URL from Cloudinary (Original Portrait for Developer)
    designerSrc: { type: String }, // Cropped Avatar URL for Designer Persona
    stars: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    source: { type: String, enum: ['manual', 'link'], default: 'manual' }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
