const express = require('express');
const { protect } = require('../middleware/auth');
const { adminAuth, logAdminAction } = require('../middleware/adminAuth');
const {
    getDashboardStats,
    getDashboardTimeline,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    exportUsers,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    toggleMovieStatus,
    getAllTheatres,
    createTheatre,
    updateTheatre,
    deleteTheatre,
    getAllBookings,
    cancelBooking,
    getAuditLogs,
    getSystemHealth,
    clearCache,
    updateAdminProfile
} = require('../controllers/adminController');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(adminAuth);

// ================== DASHBOARD ==================
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/timeline', getDashboardTimeline);

// ================== USERS ==================
router.get('/users', getAllUsers);
router.post('/users', logAdminAction('CREATE', 'User'), createUser);
router.put('/users/:id', logAdminAction('UPDATE', 'User'), updateUser);
router.delete('/users/:id', logAdminAction('DELETE', 'User'), deleteUser);
router.post('/users/bulk-update', logAdminAction('BULK_UPDATE', 'User'), bulkUpdateUsers);
router.get('/users/export', exportUsers);

// ================== MOVIES ==================
router.get('/movies', getAllMovies);
router.post('/movies', logAdminAction('CREATE', 'Movie'), createMovie);
router.put('/movies/:id', logAdminAction('UPDATE', 'Movie'), updateMovie);
router.delete('/movies/:id', logAdminAction('DELETE', 'Movie'), deleteMovie);
router.patch('/movies/:id/status', logAdminAction('STATUS_CHANGE', 'Movie'), toggleMovieStatus);

// ================== THEATRES ==================
router.get('/theatres', getAllTheatres);
router.post('/theatres', logAdminAction('CREATE', 'Theatre'), createTheatre);
router.put('/theatres/:id', logAdminAction('UPDATE', 'Theatre'), updateTheatre);
router.delete('/theatres/:id', logAdminAction('DELETE', 'Theatre'), deleteTheatre);

// ================== BOOKINGS ==================
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/cancel', logAdminAction('CANCEL', 'Booking'), cancelBooking);

// ================== AUDIT LOGS ==================
router.get('/audit-logs', getAuditLogs);

// ================== SYSTEM ==================
router.get('/system/health', getSystemHealth);
router.post('/system/cache/clear', logAdminAction('CACHE_CLEAR', 'System'), clearCache);
router.put('/profile', logAdminAction('UPDATE', 'Profile'), updateAdminProfile);

module.exports = router;
