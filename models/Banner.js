const mongoose = require('mongoose');

// Define the Banner schema
const bannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
