const express = require('express');
const router = express.Router();
const {
    getTheatres,
    getTheatre
} = require('../controllers/theatreController');

router.route('/')
    .get(getTheatres);

router.route('/:id')
    .get(getTheatre);

module.exports = router;
