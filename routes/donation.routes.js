const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../razorpayInstance');
const Donation = require('../models/Donation');

// 🔸 Create Razorpay order
router.post('/create-order', (req, res) => {

    // STEP 1:
    const { amount, currency, receipt, notes } = req.body;

    // STEP 2:    
    razorpay.orders.create({ amount, currency, receipt, notes },
        (err, order) => {

            //STEP 3 & 4: 
            if (!err)
                res.json({
                    success: true,
                    message: "Order has been created successfully",
                    order: order
                })
            else
                res.send(err);
        }
    )
});

// 🔸 Verify payment and save to DB
// router.post('/verify-order', async (req, res) => {
//     const {
//         order_id,
//         payment_id,
//         first_name,
//         last_name,
//         city,
//         mobile,
//         email,
//         donation_type,
//         reason = '', // default to empty string if not provided
//         payment_mode,
//         amount,
//     } = req.body;

//     const razorpay_signature = req.headers['x-razorpay-signature'];
//     const key_secret = process.env.RAZORPAY_KEY_SECRET;

//     // Create expected signature
//     let hmac = crypto.createHmac('sha256', key_secret);
//     hmac.update(order_id + "|" + payment_id);
//     const generated_signature = hmac.digest('hex');

//     if (razorpay_signature === generated_signature) {
//         // VERIFIED PAYMENT
//         try {
//             const donation = new Donation({
//                 first_name,
//                 last_name,
//                 city,
//                 mobile,
//                 email,
//                 donation_type,
//                 payment_mode,
//                 amount,
//                 status: 'success',
//                 razorpay_order_id: order_id,
//                 razorpay_payment_id: payment_id,
//                 razorpay_signature,
//             });

//             await donation.save();

//             res.json({
//                 success: true,
//                 message: "Payment verified and donation saved.",
//                 donation
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Error saving donation",
//                 error
//             });
//         }
//     } else {
//         // FAILED PAYMENT
//         try {
//             const donation = new Donation({
//                 first_name,
//                 last_name,
//                 city,
//                 mobile,
//                 email,
//                 donation_type,
//                 payment_mode,
//                 reason,
//                 amount,
//                 status: 'failed',
//                 razorpay_order_id: order_id,
//                 razorpay_payment_id: payment_id,
//                 razorpay_signature,
//             });

//             await donation.save();

//             res.json({
//                 success: false,
//                 message: "Payment verification failed. Donation attempt stored.",
//                 donation
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Error saving failed donation attempt",
//                 error
//             });
//         }
//     }

// });

// 🔸 Verify payment and save to DB
router.post('/verify-order', async (req, res) => {
    const {
        order_id,
        payment_id = '',
        first_name,
        last_name,
        city,
        mobile,
        email,
        donation_type,
        payment_mode,
        amount,
    } = req.body;

    const razorpay_signature = req.headers['x-razorpay-signature'];
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // STEP: Generate expected signature
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(order_id + "|" + payment_id);
    const generated_signature = hmac.digest('hex');

    // ✅ SUCCESS CASE
    if (razorpay_signature === generated_signature && payment_id) {
        try {
            const donation = new Donation({
                first_name,
                last_name,
                city,
                mobile,
                email,
                donation_type,
                payment_mode,
                amount,
                status: 'success',
                razorpay_order_id: order_id,
                razorpay_payment_id: payment_id,
                razorpay_signature,
            });

            await donation.save();

            return res.json({
                success: true,
                message: "Payment verified and donation saved.",
                donation
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error saving donation",
                error
            });
        }
    }

    // ❌ FAILURE CASE
    let failureReason = 'Payment verification failed.';

    // Only try to fetch payment details if payment_id is available
    if (payment_id) {
        try {
            const payment = await razorpay.payments.fetch(payment_id);
            failureReason = payment.error_description || payment.error_reason || failureReason;
        } catch (error) {
            failureReason = `Failed to fetch payment details: ${error.message}`;
        }
    } else {
        failureReason = 'No payment ID provided; payment likely failed before processing.';
    }

    try {
        const donation = new Donation({
            first_name,
            last_name,
            city,
            mobile,
            email,
            donation_type,
            payment_mode,
            amount,
            status: 'failed',
            reason: failureReason,
            razorpay_order_id: order_id,
            razorpay_payment_id: payment_id || null,
            razorpay_signature: razorpay_signature || null,
        });

        await donation.save();

        res.json({
            success: false,
            message: "Payment failed. Donation attempt stored.",
            reason: failureReason,
            donation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error saving failed donation attempt",
            error: error.message
        });
    }
});


// 🔸 Handle cash donations
router.post('/donate-cash', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            city,
            mobile,
            email,
            donation_type,
            amount,
            reason = '',
        } = req.body;

        // Optional: Validate required fields here

        const donation = new Donation({
            first_name,
            last_name,
            city,
            mobile,
            email,
            donation_type,
            payment_mode: 'cash',
            transaction_id: `CASH-${Date.now()}`, // Unique offline transaction ID
            amount,
            reason,
            status: 'success', // since it's handed in person
            date: new Date(),
        });

        await donation.save();
        res.json({ status: true, message: 'Cash donation recorded.', donation });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});
;

router.get('/list', async (req, res) => {
    try {
        // Get page and limit from query params with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch donations with pagination
        const donations = await Donation.find()
            .sort({ date: -1 }) // latest first
            .skip(skip)
            .limit(limit);

        const total = await Donation.countDocuments();

        res.json({
            status: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDonations: total,
            data: donations,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error fetching donations',
            error: err.message,
        });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const donationId = req.params.id;
        const deletedDonation = await Donation.findByIdAndDelete(donationId);

        if (!deletedDonation) {
            return res.status(404).json({ status: false, message: 'Donation not found' });
        }

        res.json({ status: true, message: 'Donation deleted successfully', data: deletedDonation });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error deleting donation', error: err.message });
    }
});

module.exports = router;
