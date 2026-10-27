const mongoose = require('mongoose');

const reviewRequestSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ReviewRequest', reviewRequestSchema);
