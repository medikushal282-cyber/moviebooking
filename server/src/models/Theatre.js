const mongoose = require('mongoose');

const TheatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a theatre name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    screens: {
        type: Number,
        required: [true, 'Please add number of screens'],
        min: [1, 'Must have at least 1 screen']
    },
    screenId: {
        type: String,
        required: [true, 'Please add a screen ID'],
        unique: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    facilities: {
        type: [String],
        default: []
    },
    seatConfiguration: {
        rows: {
            type: Number,
            default: 10
        },
        cols: {
            type: Number,
            default: 10
        },
        aisles: {
            type: [Number], // Column indices where there is a gap
            default: []
        }
    }
}, {
    timestamps: true
});

// Create indexes
TheatreSchema.index({ name: 1 });
TheatreSchema.index({ location: 1 });

module.exports = mongoose.model('Theatre', TheatreSchema);
