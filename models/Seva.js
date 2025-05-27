const mongoose = require('mongoose');

const sevaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    quote: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seva', sevaSchema);
