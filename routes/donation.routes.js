const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../razorpayInstance');
const Donation = require('../models/Donation');

// 🔸 Create Razorpay order
router.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Convert to paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            status: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

// 🔸 Verify payment and save to DB
router.post('/verify-payment', async (req, res) => {
    console.log(req.body.razorpay_order_id);
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        donorDetails
    } = req.body;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            const donation = new Donation({
                ...donorDetails,
                payment_mode: 'online',
                transaction_id: razorpay_payment_id,
                date: new Date(),
            });

            await donation.save();

            res.json({ status: true, message: 'Donation successful and saved.' });
        } catch (err) {
            res.status(500).json({ status: false, message: 'DB Save Error', error: err.message });
        }
    } else {
        res.status(400).json({ status: false, message: 'Invalid signature, payment verification failed.' });
    }
});

// 🔸 Handle cash donations
router.post('/donate-cash', async (req, res) => {
    try {
        const donation = new Donation({
            ...req.body,
            payment_mode: 'cash',
            transaction_id: `CASH-${Date.now()}`,
            date: new Date(),
        });

        await donation.save();
        res.json({ status: true, message: 'Cash donation recorded.' });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 }); // latest first
        res.json({ status: true, data: donations });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching donations', error: err.message });
    }
});

module.exports = router;
