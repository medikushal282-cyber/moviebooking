const express = require('express');
const {
    getShowtimesByMovie,
    getShowtime,
    createShowtime
} = require('../controllers/showtimeController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/movie/:movieId')
    .get(getShowtimesByMovie);

router.route('/:id')
    .get(getShowtime);

router.route('/')
    .post(protect, authorize('admin'), createShowtime);

module.exports = router;
