const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., 'review_submitted'
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String } // optional link to view the item
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
