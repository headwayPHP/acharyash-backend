const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: { type: String, required: false },
    image: { type: String, required: true },
    altText: { type: String, required: false },
    is_featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);
