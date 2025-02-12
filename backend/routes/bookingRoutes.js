const express = require('express');
const router = express.Router();
const {protect, checkAdmin} = require('../middleware/authMiddleware');
const { userBooking, getAllBookings, getBookingById, updateBooking, cancelBooking } = require('../controllers/bookingController');

router.post('/bookings', protect, userBooking);
router.get('/bookings', protect, checkAdmin,  getAllBookings);
router.get('/bookings/:id', protect, getBookingById);
router.put('/bookings/:id', protect,updateBooking);
router.delete('/bookings/:id', protect,  cancelBooking); 

module.exports = router; 