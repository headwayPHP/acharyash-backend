// models/ContactUs.js

const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    }, phone: {
        type: Number, required: true,
    }, email: {
        type: String, required: true,
    }, message: {
        type: String, required: true,
    }, status: {
        type: String, enum: ['pending', 'resolved','processing'], default: 'pending', // Default status will be "pending"
    }, createdAt: {
        type: Date, default: Date.now,
    }, updatedAt: {
        type: Date, default: Date.now,
    },
});

module.exports = mongoose.model('ContactUs', contactUsSchema);
