const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hdmixture_portfolio';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        const Testimonial = require('../models/Testimonial');
        const updateResult = await Testimonial.updateMany({}, { $set: { isApproved: true } });
        console.log('Update result:', updateResult);

        const current = await Testimonial.find({});
        console.log('All approved testimonials:', JSON.stringify(current, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
