const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    donation_type: { type: String, required: true },
    payment_mode: { type: String, enum: ['online', 'cash'], required: true },
    amount: { type: Number, required: true },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String, required: false },
    razorpay_signature: { type: String, required: false },
    status: { type: String, enum: ['success', 'failed'], required: true },
    reason: { type: String, default: '' }, // for failed payment
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', donationSchema);
