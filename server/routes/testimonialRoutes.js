const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Testimonial = require('../models/Testimonial');
const ReviewRequest = require('../models/ReviewRequest');
const Notification = require('../models/Notification');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { all } = req.query;
        // If all=true, fetch everything for admin. Otherwise fetch only approved ones.
        const query = all === 'true' ? {} : { isApproved: true };
        const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all review requests (Admin tracking)
// @route   GET /api/testimonials/requests
// @access  Private
router.get('/requests', async (req, res) => {
    try {
        const requests = await ReviewRequest.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Validate a review token
// @route   GET /api/testimonials/validate-token/:token
// @access  Public
router.get('/validate-token/:token', async (req, res) => {
    try {
        const request = await ReviewRequest.findOne({ token: req.params.token });
        if (!request) {
            return res.status(404).json({ valid: false, message: 'Invalid token' });
        }
        if (request.isUsed) {
            return res.status(400).json({ valid: false, used: true, message: 'Link already used' });
        }
        res.json({ valid: true, role: request.role });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Revoke a review request
// @route   DELETE /api/testimonials/requests/:id
// @access  Private (Admin)
router.delete('/requests/:id', async (req, res) => {
    try {
        await ReviewRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review request revoked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error revoking request' });
    }
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Public (with valid token) OR Private (Admin)
router.post('/', async (req, res) => {
    try {
        const { token, ...testimonialData } = req.body;
        
        let isApproved = false; // By default, client submissions are pending approval
        let source = 'manual';

        // If a token is provided, validate and mark as used
        if (token) {
            const request = await ReviewRequest.findOne({ token });
            if (!request || request.isUsed) {
                return res.status(400).json({ message: 'Invalid or expired review link.' });
            }
            request.isUsed = true;
            await request.save();

            source = 'link';

            // Create notification for Admin
            await Notification.create({
                type: 'review_submitted',
                message: `New testimonial submitted by ${testimonialData.name} (${testimonialData.designation})`,
                link: '/admin/testimonials'
            });
        } else {
            // Admin manually adding it, so it can be approved by default
            isApproved = true;
            source = 'manual';
        }

        const testimonial = new Testimonial({ ...testimonialData, isApproved, source });
        const created = await testimonial.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            Object.assign(testimonial, req.body);
            const updated = await testimonial.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Toggle Approve Testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private
router.put('/:id/approve', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            testimonial.isApproved = !testimonial.isApproved;
            const updated = await testimonial.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ message: 'Removed successfully' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Send a review request link via email
// @route   POST /api/testimonials/request-review
// @access  Private
router.post('/request-review', async (req, res) => {
    try {
        const { email, role, baseUrl } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');
        
        // Save to ReviewRequest tracking DB
        await ReviewRequest.create({ email, role, token });

        const transporter = require('../config/nodemailer');
        
        // Use provided baseUrl or fallback
        const origin = baseUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
        const reviewLink = `${origin}/submit-review?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@hdmixture.com',
            to: email,
            subject: 'Review Request - HD Mixture',
            html: `
                <div style="font-family: Arial, sans-serif; max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-xl">
                    <h2 style="color: #333;">Hello!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        I would love to hear your feedback on my work as a <strong>${role}</strong>. 
                        Your testimonial means a lot to me and helps me grow.
                    </p>
                    <div style="margin: 30px 0;">
                        <a href="${reviewLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Submit Testimonial
                        </a>
                    </div>
                    <p style="color: #777; font-size: 12px;">
                        If the button doesn't work, copy and paste this link in your browser: <br/>
                        <a href="${reviewLink}">${reviewLink}</a>
                    </p>
                    <p style="color: #555; margin-top: 30px;">Thank you!<br/>Darshan (HD Mixture)</p>
                </div>
            `
        };

        // Attempt to send email, but gracefully fallback if SMTP is not configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            res.json({ message: 'Review link sent successfully via email!' });
        } else {
            console.log('EMAIL SIMULATION (SMTP not configured):');
            console.log(`To: ${email}`);
            console.log(`Link: ${reviewLink}`);
            res.json({ message: 'Review link generated! (Check server console, SMTP not configured)' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

module.exports = router;
