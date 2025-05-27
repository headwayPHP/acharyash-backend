const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const upload = require('../middlewares/upload')('bookings', 'booking');

// POST /api/bookings
router.post('/', upload.single('image'),bookingController.createBooking);

// GET /api/bookings
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id
router.put('/:id', upload.single('image'),bookingController.updateBooking);

// DELETE /api/bookings/:id
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
