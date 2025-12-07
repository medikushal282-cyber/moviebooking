const amqp = require('amqplib');

let channel = null;
let connection = null;

const connectRabbitMQ = async () => {
    try {
        if (channel) {
            return channel;
        }

        const amqpServer = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(amqpServer);

        // Handle connection errors/closures
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

        // Assert queues we need
        await channel.assertQueue('email_queue', { durable: true });

        console.log('✅ RabbitMQ Connected');
        return channel;
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error.message);
        // Retry connection after 5 seconds
        setTimeout(connectRabbitMQ, 5000);
    }
};

const publishToQueue = async (queueName, data) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
        console.log(`Sent to ${queueName}:`, data);
    } catch (error) {
        console.error('Error publishing to queue:', error.message);
        throw error; // Throw error so controller can handle fallback
    }
};

const getChannel = () => channel;

module.exports = {
    connectRabbitMQ,
    publishToQueue,
    getChannel
};
