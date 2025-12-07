const amqp = require('amqplib');

let channel = null;
let connection = null;

const connectRabbitMQ = async () => {
    // Skip if RABBITMQ_URL is not set
    if (!process.env.RABBITMQ_URL) {
        console.log('RabbitMQ: Skipping connection (RABBITMQ_URL not set)');
        return null;
    }

    try {
        if (channel) {
            return channel;
        }

        connection = await amqp.connect(process.env.RABBITMQ_URL);

        connection.on('error', (err) => {
            console.error('❌ RabbitMQ Connection Error:', err.message);
            channel = null;
            connection = null;
        });

        connection.on('close', () => {
            console.warn('⚠️ RabbitMQ Connection Closed');
            channel = null;
            connection = null;
        });

        channel = await connection.createChannel();
        await channel.assertQueue('email_queue', { durable: true });

        console.log('✅ RabbitMQ Connected');
        return channel;
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error.message);
        // Don't retry in production without proper config
        return null;
    }
};

const publishToQueue = async (queueName, data) => {
    try {
        if (!channel) {
            console.log('RabbitMQ not connected, skipping email queue');
            return; // Silently skip if not connected
        }
        channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
        console.log(`Sent to ${queueName}:`, data);
    } catch (error) {
        console.error('Error publishing to queue:', error.message);
        // Don't throw - just log and continue
    }
};

const getChannel = () => channel;

module.exports = {
    connectRabbitMQ,
    publishToQueue,
    getChannel
};
