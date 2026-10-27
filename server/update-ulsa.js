require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');
const connectDB = require('./config/db');

async function updateDB() {
    try {
        await connectDB();
        
        await Achievement.updateMany(
            { organization: 'United Latino Students Association' },
            { $set: { organization: 'ULSA' } }
        );
        
        console.log('Database updated: Changed to ULSA');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateDB();
