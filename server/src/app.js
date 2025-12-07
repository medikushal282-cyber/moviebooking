const express = require('express'); // Trigger restart
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startWorker } = require('./workers/emailWorker');
require('dotenv').config();

// Route files
const movies = require('./routes/movies');
const theatres = require('./routes/theatres');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const otp = require('./routes/otp');
const admin = require('./routes/adminRoutes');

const app = express();

// Connect to database
connectDB();
// Connect to RabbitMQ and start worker
connectRabbitMQ().then(() => {
    startWorker();
});

// Middleware
const requestLogger = require('./middleware/requestLogger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers - configure CSP to allow CDN scripts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
                "https://cdn.tailwindcss.com",
                "https://unpkg.com",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'",
                "https://cdn.tailwindcss.com",
                "https://fonts.googleapis.com",
                "https://unpkg.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:", "wss:"],
            mediaSrc: ["'self'", "https:", "blob:"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Rate limiting - more generous for production
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for setup endpoints
        return req.path.includes('seed') || req.path.includes('regenerate');
    }
});
app.use(limiter);

app.use(requestLogger);
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/trailers', express.static(path.join(__dirname, '../../trailers')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Mount routes
app.use('/api/v1/movies', movies);
app.use('/api/v1/theatres', theatres);
app.use('/api/v1/auth', auth);
app.use('/api/v1/profile', profile);
app.use('/api/v1/otp', otp);
app.use('/api/v1/admin', admin);
app.use('/api/v1/bookings', require('./routes/bookings'));
app.use('/api/v1/showtimes', require('./routes/showtimes'));
app.use('/api/v1/payment', require('./routes/payment'));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../')));

    // Handle SPA routing - serve index.html for any non-API routes
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(__dirname, '../../index.html'));
    });
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Regenerate showtimes with future dates
app.get('/api/regenerate-showtimes', async (req, res) => {
    try {
        const Movie = require('./models/Movie');
        const Theatre = require('./models/Theatre');
        const Showtime = require('./models/Showtime');

        // Delete old showtimes
        await Showtime.deleteMany({});

        const movies = await Movie.find().limit(20);
        const theatres = await Theatre.find();

        if (movies.length === 0 || theatres.length === 0) {
            return res.json({ success: false, message: 'No movies or theatres found' });
        }

        let count = 0;
        const now = new Date();

        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
            // Each movie in 3 random theatres
            const selectedTheatres = theatres.sort(() => 0.5 - Math.random()).slice(0, 3);

            for (const theatre of selectedTheatres) {
                // 3 days starting from tomorrow, 3 shows per day
                for (let day = 1; day <= 3; day++) {
                    for (let showNum = 0; showNum < 3; showNum++) {
                        const startTime = new Date();
                        // Start from tomorrow to ensure future dates
                        startTime.setDate(startTime.getDate() + day);
                        // Use fixed hours that work globally: 9am, 2pm, 7pm UTC
                        startTime.setUTCHours(9 + (showNum * 5), 0, 0, 0);

                        // Generate seats
                        const seats = [];
                        const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                        for (let r = 0; r < 10; r++) {
                            for (let c = 1; c <= 12; c++) {
                                seats.push({ row: rowLabels[r], number: c, status: 'Available' });
                            }
                        }

                        await Showtime.create({
                            movie: movie._id,
                            theatre: theatre._id,
                            startTime,
                            endTime: new Date(startTime.getTime() + (movie.duration || 120) * 60000),
                            price: 150 + (i * 5),
                            screen: (showNum % 3) + 1,
                            seats
                        });
                        count++;
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `Created ${count} showtimes for ${movies.length} movies`,
            data: { showtimes: count }
        });
    } catch (error) {
        console.error('Regenerate showtimes error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// One-time seed endpoint for production (remove after use)
app.get('/api/seed-database', async (req, res) => {
    try {
        const Movie = require('./models/Movie');
        const Theatre = require('./models/Theatre');
        const User = require('./models/User');
        const Showtime = require('./models/Showtime');

        // Check if already seeded
        const movieCount = await Movie.countDocuments();
        if (movieCount > 0) {
            return res.json({ success: false, message: 'Database already has data. Skipping seed.' });
        }

        // Import seed data
        const { MOVIES_DATA, THEATRES_DATA } = require('./scripts/seedDatabase');

        // Seed movies
        const movies = MOVIES_DATA.map(({ id, ...rest }) => rest);
        await Movie.insertMany(movies);

        // Seed theatres
        const theatres = THEATRES_DATA.map(({ id, ...rest }) => ({
            ...rest,
            seatConfiguration: { rows: 10, cols: 12, aisles: [4, 9] }
        }));
        await Theatre.insertMany(theatres);

        // Create admin user
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (!existingAdmin) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '9999999999',
                emailVerified: true
            });
        }

        // Create showtimes
        const movieDocs = await Movie.find();
        const theatreDocs = await Theatre.find();
        const now = new Date();

        for (let i = 0; i < Math.min(movieDocs.length, 10); i++) {
            const movie = movieDocs[i];
            const theatre = theatreDocs[i % theatreDocs.length];

            for (let d = 0; d < 3; d++) {
                const startTime = new Date(now);
                startTime.setDate(startTime.getDate() + d);
                startTime.setHours(14 + (i % 8), 0, 0, 0);

                const seats = [];
                const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                for (let r = 0; r < 10; r++) {
                    for (let c = 1; c <= 12; c++) {
                        seats.push({ row: rowLabels[r], number: c, status: 'Available' });
                    }
                }

                await Showtime.create({
                    movie: movie._id,
                    theatre: theatre._id,
                    startTime,
                    endTime: new Date(startTime.getTime() + movie.duration * 60000),
                    price: 150 + (i * 10),
                    screen: 1,
                    seats
                });
            }
        }

        res.json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                movies: await Movie.countDocuments(),
                theatres: await Theatre.countDocuments(),
                showtimes: await Showtime.countDocuments()
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

const { initWebSocket } = require('./config/websocket');

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

initWebSocket(server);

module.exports = app;
