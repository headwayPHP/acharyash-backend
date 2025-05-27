const Booking = require('../models/Booking');

exports.createBooking = async (data) => {
    return await Booking.create(data);
};

exports.getAllBookings = async () => {
    return await Booking.find().sort({ createdAt: -1 });
};

exports.getBookingById = async (id) => {
    return await Booking.findById(id);
};

exports.updateBooking = async (id, data) => {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBooking = async (id) => {
    return await Booking.findByIdAndDelete(id);
};

exports.countAllBookings = async () => Booking.countDocuments();
exports.countPendingBookings = async () => Booking.countDocuments({ status: 'pending' });
