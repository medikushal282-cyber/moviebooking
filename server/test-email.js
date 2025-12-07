// Quick test script to verify email configuration
// Run this with: node test-email.js

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ Email configuration is valid!');

        // Send test email
        const info = await transporter.sendMail({
            from: `BookYourShow <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email - BookYourShow',
            html: '<h1>Email Configuration Works!</h1><p>Your Nodemailer setup is correct.</p>'
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);

    } catch (error) {
        console.error('❌ Email configuration error:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n⚠️  AUTHENTICATION FAILED');
            console.log('This usually means:');
            console.log('1. You need to use an App Password instead of your regular Gmail password');
            console.log('2. Steps to create App Password:');
            console.log('   a. Go to https://myaccount.google.com/security');
            console.log('   b. Enable 2-Factor Authentication');
            console.log('   c. Go to https://myaccount.google.com/apppasswords');
            console.log('   d. Create new app password for "Mail"');
            console.log('   e. Copy the 16-character password');
            console.log('   f. Update EMAIL_PASSWORD in .env file');
        }
    }
}

testEmail();
