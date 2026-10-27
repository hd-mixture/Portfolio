require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const projectRoutes = require('./routes/projectRoutes');
const designRoutes = require('./routes/designRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const techStackRoutes = require('./routes/techStackRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
