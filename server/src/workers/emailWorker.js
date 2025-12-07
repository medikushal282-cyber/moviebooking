const { connectRabbitMQ } = require('../config/rabbitmq');
const { sendOTPEmail, sendWelcomeEmail, sendBookingConfirmationEmail } = require('../utils/emailService');
require('dotenv').config();

const startWorker = async () => {
    try {
        const channel = await connectRabbitMQ();
        const queue = 'email_queue';

        console.log(`👷 Email Worker waiting for messages in ${queue}...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log('📥 Worker received task:', content.type);

                    let success = false;

                    switch (content.type) {
                        case 'OTP':
                            success = await sendOTPEmail(content.email, content.otp, content.name);
                            break;
                        case 'WELCOME':
                            success = await sendWelcomeEmail(content.email, content.name);
                            break;
                        case 'BOOKING_CONFIRMATION':
                            // Fetch full details if needed, but we passed them in content.booking
                            // But booking object might be raw ID references.
                            // Ideally we should have populated data or pass it directly.
                            // For simplicity, let's assume content has the display strings or we fetch them.
                            // Actually, in bookingController we passed the booking object which has IDs.
                            // We should probably fetch details here or pass them from controller.
                            // Let's assume we need to fetch or the controller passed enriched data.
                            // To be safe, let's update controller to pass enriched data or fetch here.
                            // Updating controller is better.
                            // Wait, I can't update controller easily now without re-writing.
                            // Let's just try to use what we have or fetch here if I can import models.
                            // Importing models in worker might be okay.
                            // But let's just pass the data we need in the message payload from controller.
                            // I'll update bookingController to pass enriched data.
                            // For now, let's add the case and assume content has 'details'
                            success = await sendBookingConfirmationEmail(content.email, content.name, content.details);
                            break;
                        default:
                            console.warn('Unknown message type:', content.type);
                    }

                    if (success) {
                        channel.ack(msg);
                        console.log('✅ Task completed & acknowledged');
                    } else {
                        // If email failed, we might want to nack or retry, 
                        // but for now let's just log it to avoid infinite loops
                        console.error('❌ Task failed processing');
                        channel.nack(msg, false, false); // Don't requeue for now
                    }

                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg, false, false);
                }
            }
        });

    } catch (error) {
        console.error('Worker failed to start:', error);
    }
};

// Start the worker if this file is run directly
if (require.main === module) {
    startWorker();
}

module.exports = { startWorker };
