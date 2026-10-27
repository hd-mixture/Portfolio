const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // SEO & Meta
    siteTitle: {
        type: String,
        default: 'Darshan Prajapati - Creative Developer & Graphic Designer'
    },
    metaDescription: {
        type: String,
        default: 'Explore the portfolio of Darshan Prajapati, a creative developer and graphic designer specializing in modern web apps and UI/UX design.'
    },
    keywords: {
        type: [String],
        default: ['Darshan Prajapati', 'Creative Developer', 'Full Stack Developer', 'Graphic Designer', 'UI/UX', 'Portfolio']
    },
    canonicalUrl: {
        type: String,
        default: 'https://darshan-prajapati.com'
    },
    ogImage: {
        type: String,
        default: '/Logos/favicon.png'
    },
    robotsIndex: {
        type: Boolean,
        default: true
    },

    // Social Links
    githubUrl: {
        type: String,
        default: 'https://github.com/hdmix'
    },
    linkedinUrl: {
        type: String,
        default: 'https://linkedin.com/in/hdmixture'
    },
    instagramUrl: {
        type: String,
        default: 'https://instagram.com/hdmixture'
    },
    twitterUrl: {
        type: String,
        default: 'https://twitter.com/hdmixture'
    },
    behanceUrl: {
        type: String,
        default: ''
    },
    dribbbleUrl: {
        type: String,
        default: ''
    },
    emailAddress: {
        type: String,
        default: 'hdmixture@gmail.com'
    },
    whatsappNumber: {
        type: String,
        default: '+919876543210'
    },

    // Appearance & System Preferences
    defaultTheme: {
        type: String,
        enum: ['system', 'dark', 'light'],
        default: 'system'
    },
    defaultPersona: {
        type: String,
        enum: ['developer', 'designer'],
        default: 'developer'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    announcementBanner: {
        enabled: { type: Boolean, default: false },
        text: { type: String, default: '🚀 Open for freelance projects & full-time roles!' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
