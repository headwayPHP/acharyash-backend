const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    donation_type: { type: String, required: true },
    payment_mode: { type: String, enum: ['online', 'cash'], required: true },
    amount: { type: Number, required: true },
    transaction_id: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', donationSchema);
