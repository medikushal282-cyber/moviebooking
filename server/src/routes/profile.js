const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    changePassword,
    deactivateAccount,
    deleteAccount,
    getBookingHistory
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// All routes are protected with JWT authentication
router.use(protect);

router.route('/')
    .get(getProfile)
    .put(updateProfile)
    .delete(deleteAccount);

router.put('/password', changePassword);
router.put('/deactivate', deactivateAccount);
router.get('/bookings', getBookingHistory);

module.exports = router;
