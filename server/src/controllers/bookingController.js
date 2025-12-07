const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const User = require('../models/User');
const { publishToQueue } = require('../config/rabbitmq');
const { broadcastSeatUpdate } = require('../config/websocket');
const mongoose = require('mongoose');

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { showtimeId, seats } = req.body;
        // seats: [{ row: 'A', number: 1 }, ...]

        const showtime = await Showtime.findById(showtimeId)
            .populate('movie', 'title')
            .populate('theatre', 'name');

        if (!showtime) {
            return res.status(404).json({ success: false, error: 'Showtime not found' });
        }

        // Check availability
        const unavailableSeats = [];
        seats.forEach(requestedSeat => {
            const seat = showtime.seats.find(s => s.row === requestedSeat.row && s.number === requestedSeat.number);
            if (!seat || seat.status !== 'Available') {
                unavailableSeats.push(`${requestedSeat.row}${requestedSeat.number}`);
            }
        });

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Seats ${unavailableSeats.join(', ')} are not available`
            });
        }

        // Update seats
        seats.forEach(requestedSeat => {
            const seat = showtime.seats.find(s => s.row === requestedSeat.row && s.number === requestedSeat.number);
            seat.status = 'Booked';
            seat.userId = req.user.id;
        });

        await showtime.save();

        // Create Booking
        const totalAmount = seats.length * showtime.price;

        const booking = await Booking.create({
            user: req.user.id,
            movie: showtime.movie._id,
            theatre: showtime.theatre._id,
            showtime: showtimeId,
            seats: seats.map(s => `${s.row}${s.number}`),
            totalAmount,
            status: 'Confirmed', // Assuming direct confirmation for now
            paymentId: 'MOCK_PAYMENT_' + Date.now()
        });

        // Broadcast seat update
        broadcastSeatUpdate(showtimeId, seats.map(s => ({
            row: s.row,
            number: s.number,
            status: 'Booked'
        })));

        // Send Email via Queue
        try {
            const user = await User.findById(req.user.id);
            await publishToQueue('email_queue', {
                type: 'BOOKING_CONFIRMATION',
                email: user.email,
                name: user.name,
                details: {
                    movie: showtime.movie.title,
                    theatre: showtime.theatre.name,
                    seats: booking.seats,
                    amount: totalAmount,
                    date: showtime.startTime,
                    bookingId: booking._id
                }
            });
        } catch (emailErr) {
            console.error('Failed to queue booking email:', emailErr);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            data: booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get my bookings
// @route   GET /api/v1/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('movie', 'title poster')
            .populate('theatre', 'name location')
            .populate('showtime', 'startTime')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('movie', 'title')
            .populate('theatre', 'name')
            .populate('showtime', 'startTime');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Make sure user owns the booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
