const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// @desc    Get showtimes for a movie
// @route   GET /api/v1/showtimes/movie/:movieId
// @access  Public
exports.getShowtimesByMovie = async (req, res, next) => {
    try {
        // Temporarily removed date filter for debugging
        const showtimes = await Showtime.find({ movie: req.params.movieId })
            .populate('theatre', 'name location city')
            .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: showtimes.length,
            data: showtimes
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single showtime
// @route   GET /api/v1/showtimes/:id
// @access  Public
exports.getShowtime = async (req, res, next) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate('movie', 'title duration genre language')
            .populate('theatre', 'name location city');

        if (!showtime) {
            return res.status(404).json({ success: false, error: 'Showtime not found' });
        }

        res.status(200).json({
            success: true,
            data: showtime
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create showtime
// @route   POST /api/v1/showtimes
// @access  Private (Admin)
exports.createShowtime = async (req, res, next) => {
    try {
        const { movie, theatre, startTime, price, screen } = req.body;

        // Validate movie and theatre
        const movieExists = await Movie.findById(movie);
        if (!movieExists) return res.status(404).json({ success: false, error: 'Movie not found' });

        const theatreExists = await Theatre.findById(theatre);
        if (!theatreExists) return res.status(404).json({ success: false, error: 'Theatre not found' });

        // Calculate endTime
        const start = new Date(startTime);
        const end = new Date(start.getTime() + movieExists.duration * 60000);

        // Initialize seats based on Theatre configuration
        const seats = [];
        const { rows: numRows, cols: numCols, aisles } = theatreExists.seatConfiguration || { rows: 10, cols: 10, aisles: [] };

        const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        for (let r = 0; r < numRows; r++) {
            const rowLabel = rowLabels[r] || `R${r + 1}`;
            let seatNum = 1;

            for (let c = 1; c <= numCols; c++) {
                // Skip if this column is an aisle (optional logic, for now just simple grid)
                // In a real app, aisles might be handled by frontend CSS grid gaps, 
                // or we can mark 'status: None' for gaps.

                seats.push({
                    row: rowLabel,
                    number: seatNum++,
                    status: 'Available'
                });
            }
        }

        const showtime = await Showtime.create({
            movie,
            theatre,
            startTime: start,
            endTime: end,
            price,
            screen,
            seats
        });

        res.status(201).json({
            success: true,
            data: showtime
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
