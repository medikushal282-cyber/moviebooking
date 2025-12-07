const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            city: req.body.city,
            age: req.body.age,
            dateOfBirth: req.body.dateOfBirth,
            avatar: req.body.avatar,
            updatedAt: Date.now()
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/v1/profile/password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide current and new password'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Deactivate account
// @route   PUT /api/v1/profile/deactivate
// @access  Private
exports.deactivateAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                isActive: false,
                deactivatedAt: Date.now(),
                updatedAt: Date.now()
            },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully',
            data: user
        });
    } catch (error) {
        console.error('Deactivate Account Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete account
// @route   DELETE /api/v1/profile
// @access  Private
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get booking history
// @route   GET /api/v1/profile/bookings
// @access  Private
exports.getBookingHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookings');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            count: user.bookings.length,
            data: user.bookings
        });
    } catch (error) {
        console.error('Get Booking History Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
