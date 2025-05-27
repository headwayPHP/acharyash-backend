const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    category: {
        type: String,
        enum: ['Acharya-Shree', 'Banquet', 'Samadhan', 'Prasad', 'Katha', 'Vachanamrut', 'Other'],
        required: true
    },
    other_category: {type:String, required: false},
    date: {type: String, required: true}, // format: dd-mm-yy
    time: {type: String, required: true}, // format: hh:mm
    no_of_person: {type: Number, required: true},
    mobile: {type: Number, required: true},
    email: {type: String},
    address: {type: String},
    description: {type: String},
    status: {
        type: String, enum: ['pending', 'resolved', 'processing'], default: 'pending', // Default status will be "pending"
    },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Booking', bookingSchema);
