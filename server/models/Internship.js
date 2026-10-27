const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'Internship', 'Job'
    location: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true }, // 'current' or 'completed'
    description: { type: String, required: true },
    logo: { type: String }, // URL from Cloudinary or external link
    companyUrl: { type: String }, // Official website link
    color: { type: String, default: '#4CAF50' },
    skills: [{ type: String }],
    letter: { type: String }, // URL for PDF or image
    gapToNext: { type: String },
    isCustomLogo: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
