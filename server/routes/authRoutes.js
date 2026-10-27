const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'hdmixture_portfolio_super_secure_jwt_secret_2026';

// Helper to seed default admin if no admin exists
const seedDefaultAdminIfNone = async () => {
    try {
        const count = await Admin.countDocuments();
        if (count === 0) {
            const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
            const defaultEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
            const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
            const defaultName = process.env.ADMIN_NAME || 'Darshan Prajapati';

            const defaultAdmin = new Admin({
                username: defaultUsername,
                email: defaultEmail,
                password: defaultPassword,
                name: defaultName,
                role: 'admin'
            });

            await defaultAdmin.save();
            console.log(`Default admin seeded successfully: ${defaultUsername} (${defaultEmail})`);
        }
    } catch (error) {
        console.error('Error seeding default admin:', error);
    }
};

// Seed on module load
seedDefaultAdminIfNone();

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { emailOrUsername, password, rememberMe } = req.body;

        if (!emailOrUsername || !emailOrUsername.trim()) {
            return res.status(400).json({ message: 'Email or Username is required.' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }

        const identifier = emailOrUsername.trim().toLowerCase();

        // Find by email OR username
        const admin = await Admin.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const expiresIn = rememberMe ? '30d' : '24h';
        const token = jwt.sign(
            { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
            JWT_SECRET,
            { expiresIn }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                name: admin.name,
                avatar: admin.avatar || '',
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'A server error occurred during login. Please try again.' });
    }
});

// PUT /api/auth/profile (Update name, email, username, avatar)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, email, username, avatar } = req.body;
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        if (username && username.trim().toLowerCase() !== admin.username) {
            const existingUser = await Admin.findOne({ username: username.trim().toLowerCase(), _id: { $ne: admin._id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username is already in use.' });
            }
            admin.username = username.trim().toLowerCase();
        }

        if (email && email.trim().toLowerCase() !== admin.email) {
            const existingEmail = await Admin.findOne({ email: email.trim().toLowerCase(), _id: { $ne: admin._id } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
            admin.email = email.trim().toLowerCase();
        }

        if (name) admin.name = name.trim();
        if (avatar !== undefined) admin.avatar = avatar;

        await admin.save();

        res.json({
            message: 'Profile updated successfully',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                name: admin.name,
                avatar: admin.avatar || '',
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile.' });
    }
});

// PUT /api/auth/password (Change password)
router.put('/password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error changing password.' });
    }
});

module.exports = router;
