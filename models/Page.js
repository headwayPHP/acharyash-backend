const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
}, {
    timestamps: true,
});

// Fix OverwriteModelError by checking if model already exists
module.exports = mongoose.models.Page || mongoose.model('Page', pageSchema);
