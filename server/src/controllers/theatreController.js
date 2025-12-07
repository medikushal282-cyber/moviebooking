const Theatre = require('../models/Theatre');
const redis = require('../config/redis');

// @desc    Get all theatres
// @route   GET /api/v1/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
    try {
        const { location } = req.query;

        // Build filter
        const filter = {};
        if (location) filter.location = { $regex: location, $options: 'i' };

        // Check cache
        const cacheKey = `theatres:${JSON.stringify(filter)}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (redisErr) {
            console.log('Redis get error:', redisErr.message);
        }

        const theatres = await Theatre.find(filter).sort({ name: 1 });

        const response = {
            success: true,
            count: theatres.length,
            data: theatres
        };

        // Cache for 2 hours
        try {
            await redis.setEx(cacheKey, 7200, JSON.stringify(response));
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

// @desc    Get single theatre
// @route   GET /api/v1/theatres/:id
// @access  Public
exports.getTheatre = async (req, res, next) => {
    try {
        const cacheKey = `theatre:${req.params.id}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (redisErr) {
            console.log('Redis get error:', redisErr.message);
        }

        const theatre = await Theatre.findById(req.params.id);

        if (!theatre) {
            return res.status(404).json({
                success: false,
                error: 'Theatre not found'
            });
        }

        const response = {
            success: true,
            data: theatre
        };

        // Cache for 2 hours
        try {
            await redis.setEx(cacheKey, 7200, JSON.stringify(response));
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
