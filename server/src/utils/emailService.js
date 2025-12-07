const nodemailer = require('nodemailer');

// Helper to format date
const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, name) => {
    try {
        console.log('📧 Attempting to send OTP email...');
        console.log('To:', email);
        console.log('OTP:', otp);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');

        const transporter = createTransporter();

        const mailOptions = {
            from: `BookYourShow <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - BookYourShow',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0E4F95;">Welcome to BookYourShow!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for registering. Please verify your email address using the OTP below:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #0E4F95; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">BookYourShow - Movie Magic Awaits</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully!');
        console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Email sending error:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
};

// Send welcome email after verification
exports.sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `BookYourShow <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to BookYourShow!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0E4F95;">Email Verified Successfully!</h2>
                    <p>Hi ${name},</p>
                    <p>Your email has been verified. You can now enjoy all features of BookYourShow!</p>
                    <p>Start booking your favorite movies now.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">BookYourShow - Movie Magic Awaits</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Welcome email error:', error);
        return false;
    }
};

// Send booking confirmation email
exports.sendBookingConfirmationEmail = async (email, name, bookingDetails) => {
    try {
        const transporter = createTransporter();
        const { movie, theatre, seats, amount, date, bookingId } = bookingDetails;

        const mailOptions = {
            from: `BookYourShow <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Booking Confirmed! - BookYourShow',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0E4F95;">Your Ticket is Confirmed!</h2>
                    <p>Hi ${name},</p>
                    <p>Get ready for the show! Here are your booking details:</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">${movie}</h3>
                        <p><strong>Theatre:</strong> ${theatre}</p>
                        <p><strong>Date & Time:</strong> ${formatDate(date)}</p>
                        <p><strong>Seats:</strong> ${seats.join(', ')}</p>
                        <p><strong>Booking ID:</strong> ${bookingId}</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
                        <p style="font-size: 18px; font-weight: bold; text-align: right;">Total Paid: $${amount}</p>
                    </div>

                    <p>Please show this email at the counter.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">BookYourShow - Movie Magic Awaits</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Booking email sent successfully!');
        return true;
    } catch (error) {
        console.error('Booking email error:', error);
        return false;
    }
};
