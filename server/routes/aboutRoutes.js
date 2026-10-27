const express = require('express');
const router = express.Router();
const About = require('../models/About');

// GET about data (creates default if it doesn't exist)
router.get('/', async (req, res) => {
    try {
        const persona = req.query.persona || 'developer';
        let about = await About.findOne({ persona });

        if (!about) {
            // Seed default data based on persona to match original frontend perfectly
            const defaultData = {
                persona: persona,
                tagline: persona === 'developer' ? "Unleash Your Imagination – Transform Ideas into Vision." : "",
                description: persona === 'developer' 
                    ? "I am a Creative Developer with hands-on experience in building mobile and web applications, skilled in both front-end and back-end technologies. My strong graphic design skills enable me to create appealing user-centric interfaces with projects that improve usability and efficiency."
                    : "I'm a passionate Graphic Designer with a love for clean design, bold ideas and creative storytelling. I help brands stand out with unique visuals, strong identities and impactful designs that connect.",
                resumeUrl: persona === 'developer' ? "/Darshan%20Prajapati_Resume_8d3ff4d89fa4d8988cba31337f895c82.pdf" : "",
                illustrationImage: persona === 'developer' ? "/About/3D-rendered_illustration.png" : "",
                services: persona === 'designer' ? [
                    { title: "Brand Identity", desc: "Logos, Guidelines, Brand Identity Design", iconName: "PenTool" },
                    { title: "Print Design", desc: "Brochures, Flyers, Posters, Business Cards", iconName: "FileText" },
                    { title: "Social Media Design", desc: "Creatives, Banners, Posts, Ads", iconName: "Layout" },
                    { title: "UI / Visual Design", desc: "Web Banners, UI Elements, Presentation Design", iconName: "MonitorPlay" },
                    { title: "Illustration", desc: "Vector Art, Icons, Custom Illustrations", iconName: "ImageIcon" },
                    { title: "Photo Editing", desc: "Retouching, Color Grading, Manipulation", iconName: "Scissors" }
                ] : []
            };

            about = await About.create(defaultData);
        }

        res.json(about);
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) about data
router.put('/', async (req, res) => {
    try {
        const persona = req.query.persona || 'developer';
        const updatedData = req.body;

        const about = await About.findOneAndUpdate(
            { persona },
            { $set: updatedData },
            { new: true, upsert: true }
        );

        res.json(about);
    } catch (error) {
        console.error('Error updating about data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
