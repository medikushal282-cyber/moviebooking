const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seats: [{
        row: String,
        number: Number,
        status: {
            type: String,
            enum: ['Available', 'Booked', 'Sold'],
            default: 'Available'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

// Prevent overlapping showtimes in the same theatre screen (assuming 1 screen for now or add screen field)
// Theatre model has 'screens' count, but we need to know WHICH screen this show is in.
// Let's add 'screen' field.

ShowtimeSchema.add({
    screen: {
        type: Number,
        required: true
    }
});

ShowtimeSchema.index({ movie: 1, theatre: 1 });
ShowtimeSchema.index({ theatre: 1, startTime: 1 });

module.exports = mongoose.model('Showtime', ShowtimeSchema);
