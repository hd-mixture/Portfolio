const express = require('express');
const router = express.Router();
const Design = require('../models/Design');

// @desc    Get all designs (optionally filtered by category)
// @route   GET /api/designs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const designs = await Design.find(query);
        res.json(designs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a new design/media asset
// @route   POST /api/designs
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { category, src, title, caption, size, dimensions } = req.body;
        
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const newDesign = new Design({
            category,
            src,
            title,
            caption,
            size: size || 0,
            dimensions: dimensions || ''
        });

        const createdDesign = await newDesign.save();
        res.status(201).json(createdDesign);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update a design/media asset
// @route   PUT /api/designs/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const { category, src, title, caption, size, dimensions } = req.body;
        const design = await Design.findById(req.params.id);

        if (design) {
            design.category = category || design.category;
            design.src = src || design.src;
            design.title = title || design.title;
            design.caption = caption !== undefined ? caption : design.caption;
            design.size = size !== undefined ? size : design.size;
            design.dimensions = dimensions !== undefined ? dimensions : design.dimensions;

            const updatedDesign = await design.save();
            res.json(updatedDesign);
        } else {
            res.status(404).json({ message: 'Design not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a design/media asset
// @route   DELETE /api/designs/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (design) {
            await design.deleteOne();
            res.json({ message: 'Design removed' });
        } else {
            res.status(404).json({ message: 'Design not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
