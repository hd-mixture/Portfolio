const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
router.get('/', async (req, res) => {
    try {
        const internships = await Internship.find({}).sort({ order: 1, createdAt: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an internship
// @route   POST /api/internships
// @access  Private
router.post('/', async (req, res) => {
    try {
        const internship = new Internship(req.body);
        const created = await internship.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (internship) {
            Object.assign(internship, req.body);
            const updated = await internship.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (internship) {
            await internship.deleteOne();
            res.json({ message: 'Removed successfully' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
