const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Hackathon', 'Certificate'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    organizationUrl: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: String,
        default: ''
    },
    endDate: {
        type: String,
        default: ''
    },
    startTime: {
        type: String,
        default: ''
    },
    endTime: {
        type: String,
        default: ''
    },
    calculatedDuration: {
        type: String,
        default: ''
    },
    participationType: {
        type: String,
        enum: ['individual', 'team'],
        default: 'individual'
    },
    achievement: {
        type: String,
        default: ''
    },
    projectName: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: ''
    },
    teamName: {
        type: String,
        default: ''
    },
    teamMembers: [
        {
            name: { type: String, default: '' },
            role: { type: String, default: '' }
        }
    ],
    solution: {
        type: String,
        default: ''
    },
    problem: {
        type: String,
        default: ''
    },
    technologies: {
        type: [String],
        default: []
    },
    keyFeatures: {
        type: [String],
        default: []
    },
    prize: {
        type: String,
        default: ''
    },
    githubUrl: {
        type: String,
        default: ''
    },
    liveDemoUrl: {
        type: String,
        default: ''
    },
    hackathonUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
