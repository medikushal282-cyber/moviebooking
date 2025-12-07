const User = require('../models/User');
const { publishToQueue } = require('../config/rabbitmq');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email
// @route   POST /api/v1/otp/send
// @access  Public
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email already verified'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to user
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP email via RabbitMQ
        await publishToQueue('email_queue', {
            type: 'OTP',
            email: user.email,
            otp: user.otp,
            name: user.name
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to email'
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send OTP'
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/v1/otp/verify
// @access  Public
const PendingUser = require('../models/PendingUser');

// ... existing imports ...

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body; // 'email' can be phone

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email/phone and OTP'
            });
        }

        const isEmail = email.includes('@');
        const query = isEmail ? { email: email.toLowerCase() } : { phone: email };

        // Check for Pending User first
        const pendingUser = await PendingUser.findOne(query).select('+password');

        if (pendingUser) {
            if (pendingUser.otp !== otp) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid OTP'
                });
            }

            // Create new User from PendingUser
            const newUser = await User.create({
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password, // Already hashed
                phone: pendingUser.phone,
                city: pendingUser.city,
                emailVerified: true, // Auto-verify since we just checked OTP
                phoneVerified: !!pendingUser.phone, // Mark phone as verified if present
                otp: undefined,
                otpExpires: undefined
            });

            // Delete PendingUser
            await PendingUser.deleteOne({ _id: pendingUser._id });

            // Send token response
            sendTokenResponse(newUser, 200, res);
            return;
        }

        // Fallback to existing User verification
        const user = await User.findOne(query).select('+otp +otpExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (user.emailVerified && isEmail) {
            return res.status(400).json({ success: false, error: 'Email already verified' });
        }
        // For phone, we might want to check phoneVerified, but keeping it simple for now

        // Check if OTP exists
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP'
            });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP'
            });
        }

        // Check if OTP expired
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                error: 'OTP expired'
            });
        }

        // Verify user
        if (isEmail) user.emailVerified = true;
        else user.phoneVerified = true;

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Send welcome email via RabbitMQ only if email exists
        if (user.email) {
            await publishToQueue('email_queue', {
                type: 'WELCOME',
                email: user.email,
                name: user.name || 'User'
            });
        }

        // Generate token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify OTP'
        });
    }
};

// @desc    Resend OTP
// @route   POST /api/v1/otp/resend
// @access  Public
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body; // 'email' can be phone

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email/phone'
            });
        }

        const isEmail = email.includes('@');
        const query = isEmail ? { email: email.toLowerCase() } : { phone: email };

        // Check for Pending User first
        const pendingUser = await PendingUser.findOne(query);

        if (pendingUser) {
            // Generate new OTP
            const otp = generateOTP();

            pendingUser.otp = otp;
            pendingUser.createdAt = Date.now();
            await pendingUser.save();

            if (pendingUser.email) {
                await publishToQueue('email_queue', {
                    type: 'OTP',
                    email: pendingUser.email,
                    otp: pendingUser.otp,
                    name: pendingUser.name
                });
            } else if (pendingUser.phone) {
                console.log(`[MOCK SMS] Resending OTP ${otp} to ${pendingUser.phone}`);
            }

            return res.status(200).json({
                success: true,
                message: `New OTP sent to ${isEmail ? 'email' : 'phone'}`
            });
        }

        // Check for existing User
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        if (user.email) {
            await publishToQueue('email_queue', {
                type: 'OTP',
                email: user.email,
                otp: user.otp,
                name: user.name
            });
        } else if (user.phone) {
            console.log(`[MOCK SMS] Resending OTP ${otp} to ${user.phone}`);
        }

        res.status(200).json({
            success: true,
            message: `New OTP sent to ${isEmail ? 'email' : 'phone'}`
        });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to resend OTP'
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
