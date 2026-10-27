const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    name: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    liveLink: { type: String, default: null },
    codeLink: { type: String, default: null },
    portfolioLink: { type: Boolean, default: false },
    behanceLink: { type: String, default: null },
    iconSrc: { type: String, default: null },
    iconClass: { type: String, default: null },
    timelineIconClass: { type: String, required: true },
    status: { type: String, enum: ['completed', 'ongoing', 'live'], required: true },
    techStack: [techStackSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
