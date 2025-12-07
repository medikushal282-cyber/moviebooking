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

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
