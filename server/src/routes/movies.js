const express = require('express');
const router = express.Router();
const {
    getMovies,
    getMovie,
    searchMovies,
    createMovie
} = require('../controllers/movieController');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getMovies)
    .post(protect, authorize('admin'), createMovie);

router.route('/search')
    .get(searchMovies);

router.route('/:id')
    .get(getMovie);

module.exports = router;
