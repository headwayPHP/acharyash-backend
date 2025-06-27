// controllers/adminDashboardController.js
const bookingService = require('../services/booking.service');
const kathaService = require('../services/katha.service');
const contactService = require('../services/contactus.service');
// const donationService = require('../services/donationService');
const settingService = require('../services/setting.service');

exports.getDashboardData = async (req, res) => {
    try {
        const [
            totalBooking,
            pendingBooking,
            totalKathas,
            todayRequests,
            totalRequests,
            // totalDonations,
            // totalDonationReceived,
            latestRequests,
            liveDarshan,
            kathaDetails
        ] = await Promise.all([
            bookingService.countAllBookings(),
            bookingService.countPendingBookings(),
            kathaService.countAllKathas(),
            contactService.countTodayRequests(),
            contactService.countAllRequests(),
            // donationService.countAllDonations(),
            // donationService.totalDonationReceived(),
            contactService.getLatestRequests(7),
            settingService.getSettingByKey('live_darshan'),
            kathaService.getLatestKathas(10)
        ]);

        return res.status(200).json({
            status: true,
            message: 'Dashboard data fetched successfully',
            data: {
                total_booking: totalBooking,
                pending_booking: pendingBooking,
                total_kathas: totalKathas,
                today_requests: todayRequests,
                total_requests: totalRequests,
                // total_donations: totalDonations,
                // total_donation_received: totalDonationReceived,
                latest_requests: latestRequests,
                live_darshan: liveDarshan,
                katha_details: kathaDetails
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
};
