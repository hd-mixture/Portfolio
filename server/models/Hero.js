const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    persona: { type: String, enum: ['developer', 'designer'], default: 'developer' },
    profileImage: { type: String, default: '/Logos/hd_image.png' },
    typewriterTexts: [{
        id: { type: String },
        text: { type: String }
    }],
    typingSpeed: { type: Number, default: 80 },
    delayBetween: { type: Number, default: 1500 },
    loopAnimation: { type: Boolean, default: true },
    socialLinks: [{
        id: { type: String },
        platform: { type: String },
        url: { type: String },
        visible: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
