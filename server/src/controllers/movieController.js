const Movie = require('../models/Movie');
const redis = require('../config/redis');

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
    try {
        const { language, genre, year, limit, search } = req.query;

        // Build filter object
        const filter = {};
        if (language) filter.language = language;
        if (genre) filter.genre = genre;
        if (year) filter.year = parseInt(year);
        if (search) filter.$text = { $search: search };

        // Check cache first
        const cacheKey = `movies:${JSON.stringify(filter)}:${limit || 'all'}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (redisErr) {
            console.log('Redis get error:', redisErr.message);
        }

        // Query database
        let query = Movie.find(filter).sort({ year: -1, createdAt: -1 });
        if (limit) query = query.limit(parseInt(limit));

        const movies = await query;

        const response = {
            success: true,
            count: movies.length,
            data: movies
        };

        // Cache result for 1 hour
        try {
            await redis.setEx(cacheKey, 3600, JSON.stringify(response));
        } catch (redisErr) {
            console.log('Redis setEx error:', redisErr.message);
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single movie
// @route   GET /api/v1/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
    try {
        const cacheKey = `movie:${req.params.id}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (redisErr) {
            console.log('Redis get error:', redisErr.message);
        }

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }

        const response = {
            success: true,
            data: movie
        };

        // Cache for 1 hour
        try {
            await redis.setEx(cacheKey, 3600, JSON.stringify(response));
        } catch (redisErr) {
            console.log('Redis setEx error:', redisErr.message);
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Search movies by title
// @route   GET /api/v1/movies/search
// @access  Public
exports.searchMovies = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a search query'
            });
        }

        const cacheKey = `search:${q}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (redisErr) {
            console.log('Redis get error:', redisErr.message);
        }

        // Search by title using regex (case-insensitive)
        const movies = await Movie.find({
            title: { $regex: q, $options: 'i' }
        }).limit(20);

        const response = {
            success: true,
            count: movies.length,
            results: movies
        };

        // Cache for 30 minutes
        try {
            await redis.setEx(cacheKey, 1800, JSON.stringify(response));
        } catch (redisErr) {
            console.log('Redis setEx error:', redisErr.message);
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new movie (Admin only - for future)
// @route   POST /api/v1/movies
// @access  Private
exports.createMovie = async (req, res, next) => {
    try {
        const movie = await Movie.create(req.body);

        // Clear cache
        try {
            const keys = await redis.keys('movies:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }
        } catch (redisErr) {
            console.log('Redis cache clear error:', redisErr.message);
        }

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
