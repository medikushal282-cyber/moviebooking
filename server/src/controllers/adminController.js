const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

// ================== DASHBOARD ==================

// Get dashboard stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalTheatres = await Theatre.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Calculate revenue (mock for now if no payment integration)
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'Confirmed' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const nowShowingMovies = await Movie.countDocuments({ status: 'Now Showing' });
        const comingSoonMovies = await Movie.countDocuments({ status: 'Coming Soon' });

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers },
                movies: { total: totalMovies, nowShowing: nowShowingMovies, comingSoon: comingSoonMovies },
                theatres: { total: totalTheatres },
                bookings: { total: totalBookings },
                revenue: { total: totalRevenue }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get activity timeline (recent audit logs)
exports.getDashboardTimeline = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const logs = await AuditLog.find()
            .populate('adminId', 'name email')
            .sort({ timestamp: -1 })
            .limit(limit);

        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================== USER MANAGEMENT ==================

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.role) {
            query.role = req.query.role;
        }

        const users = await User.find(query)
            .select('-password -otp')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create user
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk update users
exports.bulkUpdateUsers = async (req, res, next) => {
    try {
        const { userIds, action, value } = req.body;
        let update = {};

        if (action === 'activate') update.isActive = true;
        else if (action === 'deactivate') update.isActive = false;
        else if (action === 'changeRole') update.role = value;
        else if (action === 'delete') {
            await User.deleteMany({ _id: { $in: userIds } });
            return res.status(200).json({ success: true, message: 'Users deleted' });
        }

        await User.updateMany({ _id: { $in: userIds } }, update);

        res.status(200).json({ success: true, message: 'Users updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Export users
exports.exportUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password -otp');
        const userData = users.map(user => ({
            ID: user._id.toString(),
            Name: user.name,
            Email: user.email,
            Role: user.role,
            Status: user.isActive ? 'Active' : 'Inactive',
            Joined: user.createdAt
        }));

        const ws = xlsx.utils.json_to_sheet(userData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Users');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================== MOVIE MANAGEMENT ==================

// Get all movies
exports.getAllMovies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Movie.countDocuments(query);

        res.status(200).json({
            success: true,
            count: movies.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: movies
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create movie
exports.createMovie = async (req, res, next) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update movie
exports.updateMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete movie
exports.deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Toggle movie status
exports.toggleMovieStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const movie = await Movie.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }

        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ================== THEATRE MANAGEMENT ==================

// Get all theatres
exports.getAllTheatres = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { city: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.city) {
            query.city = { $regex: req.query.city, $options: 'i' };
        }

        const theatres = await Theatre.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Theatre.countDocuments(query);

        res.status(200).json({
            success: true,
            count: theatres.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: theatres
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create theatre
exports.createTheatre = async (req, res, next) => {
    try {
        const theatre = await Theatre.create(req.body);
        res.status(201).json({ success: true, data: theatre });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update theatre
exports.updateTheatre = async (req, res, next) => {
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!theatre) {
            return res.status(404).json({ success: false, error: 'Theatre not found' });
        }

        res.status(200).json({ success: true, data: theatre });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete theatre
exports.deleteTheatre = async (req, res, next) => {
    try {
        const theatre = await Theatre.findByIdAndDelete(req.params.id);

        if (!theatre) {
            return res.status(404).json({ success: false, error: 'Theatre not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================== BOOKING MANAGEMENT ==================

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.search) {
            // Assuming search by booking ID or user name/email
            // This is complex with lookups, for now simple ID match or status
            if (mongoose.Types.ObjectId.isValid(req.query.search)) {
                query._id = req.query.search;
            } else {
                // query.status = { $regex: req.query.search, $options: 'i' };
            }
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('movie', 'title')
            .populate('theatre', 'name')
            .sort({ bookingDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, {
            new: true
        });

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================== AUDIT LOGS ==================

// Get audit logs
exports.getAuditLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.adminId) query.adminId = req.query.adminId;
        if (req.query.action) query.action = req.query.action;
        if (req.query.resource) query.resource = req.query.resource;

        const logs = await AuditLog.find(query)
            .populate('adminId', 'name email')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ================== SYSTEM MANAGEMENT ==================

// Get system health
exports.getSystemHealth = async (req, res, next) => {
    try {
        const mongoose = require('mongoose');

        const health = {
            database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date()
        };

        res.status(200).json({
            success: true,
            data: health
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Clear cache (if Redis is being used)
exports.clearCache = async (req, res, next) => {
    try {
        // TODO: Implement Redis cache clearing when Redis is integrated
        res.status(200).json({
            success: true,
            message: 'Cache cleared successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name
        };

        if (req.body.password) {
            fieldsToUpdate.password = req.body.password;
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
