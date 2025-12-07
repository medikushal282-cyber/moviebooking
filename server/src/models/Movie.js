const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a movie title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre']
    },
    language: {
        type: String,
        required: [true, 'Please add a language']
    },
    format: {
        type: String,
        enum: ['2D', '3D', 'IMAX'],
        default: '2D'
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [10, 'Rating cannot be more than 10']
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes']
    },
    age: {
        type: String,
        enum: ['U', 'UA', 'A'],
        required: [true, 'Please add age rating']
    },
    year: {
        type: Number,
        required: [true, 'Please add release year']
    },
    img: {
        type: String,
        required: [true, 'Please add a poster image path']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    badge: {
        type: String,
        default: ''
    },
    trailer: {
        type: String,
        default: ''
    },
    cast: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Now Showing', 'Coming Soon', 'Ended'],
        default: 'Now Showing'
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
MovieSchema.index({ title: 'text' }, { language_override: 'dummy_language' });
MovieSchema.index({ language: 1 });
MovieSchema.index({ genre: 1 });
MovieSchema.index({ year: -1 });

module.exports = mongoose.model('Movie', MovieSchema);
