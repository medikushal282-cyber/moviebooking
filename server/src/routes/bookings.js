const express = require('express');
const {
    createBooking,
    getMyBookings,
    getBooking
} = require('../controllers/bookingController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .post(createBooking);

router.route('/mybookings')
    .get(getMyBookings);

router.route('/:id')
    .get(getBooking);

module.exports = router;
