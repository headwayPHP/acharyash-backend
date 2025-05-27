const bookingService = require('../services/booking.service');

exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json({ status: true, message: 'Booking created successfully', data: booking });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();

        const formattedBookings = bookings.map(booking => {
            const [hour, minute] = booking.time.split(':');
            let h = parseInt(hour);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12; // convert 0 to 12 for 12 AM
            const formattedTime = `${h.toString().padStart(2, '0')}:${minute} ${ampm}`;

            return {
                ...booking._doc, // if you're using Mongoose, this ensures raw object
                time: formattedTime
            };
        });

        res.status(200).json({ status: true, data: formattedBookings });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }
        res.status(200).json({ status: true, data: booking });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const updated = await bookingService.updateBooking(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }
        res.status(200).json({ status: true, message: 'Booking updated', data: updated });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const deleted = await bookingService.deleteBooking(req.params.id);
        if (!deleted) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }
        res.status(200).json({ status: true, message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
