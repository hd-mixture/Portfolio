const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');

// GET all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single achievement
router.get('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new achievement
router.post('/', async (req, res) => {
    const achievement = new Achievement({
        category: req.body.category,
        title: req.body.title,
        organization: req.body.organization,
        organizationUrl: req.body.organizationUrl || '',
        date: req.body.date,
        description: req.body.description,
        image: req.body.image,
        link: req.body.link,
        order: req.body.order || 0,
        isWinner: req.body.isWinner || false,
        startDate: req.body.startDate || '',
        endDate: req.body.endDate || '',
        startTime: req.body.startTime || '',
        endTime: req.body.endTime || '',
        calculatedDuration: req.body.calculatedDuration || '',
        participationType: req.body.participationType || 'individual',
        achievement: req.body.achievement || '',
        projectName: req.body.projectName || '',
        role: req.body.role || '',
        teamName: req.body.teamName || '',
        teamMembers: req.body.teamMembers || [],
        problem: req.body.problem || '',
        solution: req.body.solution || '',
        technologies: req.body.technologies || [],
        keyFeatures: req.body.keyFeatures || [],
        prize: req.body.prize || '',
        githubUrl: req.body.githubUrl || '',
        liveDemoUrl: req.body.liveDemoUrl || '',
        hackathonUrl: req.body.hackathonUrl || ''
    });

    try {
        const newAchievement = await achievement.save();
        res.status(201).json(newAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update achievement
router.put('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

        if (req.body.category !== undefined) achievement.category = req.body.category;
        if (req.body.title !== undefined) achievement.title = req.body.title;
        if (req.body.organization !== undefined) achievement.organization = req.body.organization;
        if (req.body.organizationUrl !== undefined) achievement.organizationUrl = req.body.organizationUrl;
        if (req.body.date !== undefined) achievement.date = req.body.date;
        if (req.body.description !== undefined) achievement.description = req.body.description;
        if (req.body.image !== undefined) achievement.image = req.body.image;
        if (req.body.link !== undefined) achievement.link = req.body.link;
        if (req.body.order !== undefined) achievement.order = req.body.order;
        if (req.body.isWinner !== undefined) achievement.isWinner = req.body.isWinner;
        if (req.body.startDate !== undefined) achievement.startDate = req.body.startDate;
        if (req.body.endDate !== undefined) achievement.endDate = req.body.endDate;
        if (req.body.startTime !== undefined) achievement.startTime = req.body.startTime;
        if (req.body.endTime !== undefined) achievement.endTime = req.body.endTime;
        if (req.body.calculatedDuration !== undefined) achievement.calculatedDuration = req.body.calculatedDuration;
        if (req.body.participationType !== undefined) achievement.participationType = req.body.participationType;
        if (req.body.achievement !== undefined) achievement.achievement = req.body.achievement;
        if (req.body.projectName !== undefined) achievement.projectName = req.body.projectName;
        if (req.body.role !== undefined) achievement.role = req.body.role;
        if (req.body.teamName !== undefined) achievement.teamName = req.body.teamName;
        if (req.body.teamMembers !== undefined) achievement.teamMembers = req.body.teamMembers;
        if (req.body.problem !== undefined) achievement.problem = req.body.problem;
        if (req.body.solution !== undefined) achievement.solution = req.body.solution;
        if (req.body.technologies !== undefined) achievement.technologies = req.body.technologies;
        if (req.body.keyFeatures !== undefined) achievement.keyFeatures = req.body.keyFeatures;
        if (req.body.prize !== undefined) achievement.prize = req.body.prize;
        if (req.body.githubUrl !== undefined) achievement.githubUrl = req.body.githubUrl;
        if (req.body.liveDemoUrl !== undefined) achievement.liveDemoUrl = req.body.liveDemoUrl;
        if (req.body.hackathonUrl !== undefined) achievement.hackathonUrl = req.body.hackathonUrl;

        const updatedAchievement = await achievement.save();
        res.json(updatedAchievement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE achievement
router.delete('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

        await achievement.deleteOne();
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
