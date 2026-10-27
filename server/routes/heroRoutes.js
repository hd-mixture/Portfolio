const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// @desc    Get Hero settings
// @route   GET /api/hero
// @access  Public
router.get('/', async (req, res) => {
    try {
        const persona = req.query.persona || 'developer';
        let hero = await Hero.findOne({ persona });
        if (!hero) {
            // Create a default hero if none exists for this persona
            hero = await Hero.create({
                persona,
                profileImage: "/Logos/hd_image.png",
                typewriterTexts: persona === 'developer' ? [
                    { id: '1', text: "Full Stack Developer" },
                    { id: '2', text: "Android Developer" }
                ] : [
                    { id: '1', text: "Graphic Designer" },
                    { id: '2', text: "Creative Technologist" }
                ],
                typingSpeed: 80,
                delayBetween: 1500,
                loopAnimation: true,
                socialLinks: [
                    { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/hdmixture/', visible: true },
                    { id: '2', platform: 'Instagram', url: 'https://instagram.com/hd_mixture', visible: true },
                    { id: '3', platform: 'GitHub', url: 'https://github.com/hd-mixture', visible: true },
                    { id: '4', platform: 'WhatsApp', url: 'https://wa.link/ey6lzx', visible: true }
                ]
            });
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update Hero settings
// @route   PUT /api/hero
// @access  Private
router.put('/', async (req, res) => {
    try {
        const persona = req.body.persona || 'developer';
        let hero = await Hero.findOne({ persona });
        if (hero) {
            Object.assign(hero, req.body);
            const updated = await hero.save();
            res.json(updated);
        } else {
            const newHero = new Hero({ ...req.body, persona });
            const created = await newHero.save();
            res.status(201).json(created);
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

module.exports = router;
