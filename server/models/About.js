const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    persona: { 
        type: String, 
        enum: ['developer', 'designer'], 
        required: true 
    },
    tagline: { 
        type: String 
    },
    description: { 
        type: String 
    },
    resumeUrl: { 
        type: String 
    },
    illustrationImage: { 
        type: String 
    },
    services: [{
        title: String,
        desc: String,
        iconName: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
