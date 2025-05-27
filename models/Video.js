const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {type: String},
    image: {type: String}, // image filename
    location: {type: String},
    url: {type: String, required: true},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Video', videoSchema);
