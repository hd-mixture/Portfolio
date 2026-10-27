const express = require('express');
const router = express.Router();
const TechStack = require('../models/TechStack');

// @desc    Get all tech stack items
// @route   GET /api/techstack
// @access  Public
router.get('/', async (req, res) => {
    try {
        const stack = await TechStack.find({}).sort({ order: 1, createdAt: -1 });
        res.json(stack);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a tech stack item
// @route   POST /api/techstack
// @access  Private
router.post('/', async (req, res) => {
    try {
        const item = new TechStack(req.body);
        const created = await item.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Update a tech stack item
// @route   PUT /api/techstack/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const item = await TechStack.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updated = await item.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete a tech stack item
// @route   DELETE /api/techstack/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const item = await TechStack.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Removed successfully' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
