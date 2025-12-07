const User = require('../models/User');
const { publishToQueue } = require('../config/rabbitmq');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const PendingUser = require('../models/PendingUser');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, city } = req.body;

        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                error: 'Please provide either an email or a phone number'
            });
        }

        // Check if user already exists
        if (email) {
            const existingUserEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingUserEmail) {
                return res.status(400).json({
                    success: false,
                    error: 'User already exists with this email'
                });
            }
        }

        if (phone) {
            const existingUserPhone = await User.findOne({ phone });
            if (existingUserPhone) {
                return res.status(400).json({
                    success: false,
                    error: 'User already exists with this phone number'
                });
            }
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Create pending user
        // Use findOneAndUpdate with upsert to handle re-registration attempts before verification
        // Query by email OR phone
        const query = {};
        if (email) query.email = email.toLowerCase();
        if (phone) query.phone = phone;

        // If both provided, query by email (edge case)
        if (email && phone) query.email = email.toLowerCase();

        let pendingUser = await PendingUser.findOne(query);

        if (pendingUser) {
            // Update existing pending user
            pendingUser.name = name || pendingUser.name;
            pendingUser.email = email ? email.toLowerCase() : pendingUser.email;
            pendingUser.phone = phone || pendingUser.phone;
            pendingUser.city = city || pendingUser.city;
            pendingUser.password = password; // Update password
            pendingUser.otp = otp;
            pendingUser.createdAt = Date.now(); // Reset TTL
            await pendingUser.save();
        } else {
            // Create new pending user
            pendingUser = await PendingUser.create({
                name,
                email: email ? email.toLowerCase() : undefined,
                password,
                phone,
                city,
                otp,
                otpExpires
            });
        }

        // Send OTP
        if (email) {
            try {
                await publishToQueue('email_queue', {
                    type: 'OTP',
                    email: pendingUser.email,
                    otp: pendingUser.otp,
                    name: pendingUser.name || 'User'
                });
            } catch (queueError) {
                console.warn('⚠️ RabbitMQ failed, falling back to direct email sending...');
                const { sendOTPEmail } = require('../utils/emailService');
                await sendOTPEmail(pendingUser.email, pendingUser.otp, pendingUser.name || 'User');
            }
        } else if (phone) {
            // Mock SMS sending for now or use a different queue
            console.log(`[MOCK SMS] Sending OTP ${otp} to ${phone}`);
            // You might want to publish to an 'sms_queue' here if you have one
        }

        res.status(201).json({
            success: true,
            message: `Registration successful. Please check your ${email ? 'email' : 'phone'} for OTP verification.`,
            email: pendingUser.email,
            phone: pendingUser.phone
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body; // 'email' field can contain email or phone

        // Validate email/phone & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email/phone and password' });
        }

        // Determine if input is email or phone
        const isEmail = email.includes('@');
        const query = isEmail ? { email: email.toLowerCase() } : { phone: email };

        // Check for user
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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
                role: user.role,
                avatar: user.avatar
            }
        });
};
