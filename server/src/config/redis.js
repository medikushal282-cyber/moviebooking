const redis = require('redis');

let client = null;

// Only connect to Redis if REDIS_URL is provided
if (process.env.REDIS_URL) {
    client = redis.createClient({
        url: process.env.REDIS_URL
    });

    client.on('error', (err) => {
        console.log('Redis Client Error', err.message);
    });

    client.on('connect', () => {
        console.log('Redis Client Connected');
    });

    (async () => {
        try {
            await client.connect();
        } catch (err) {
            console.log('Failed to connect to Redis:', err.message);
        }
    })();
} else {
    console.log('Redis: Skipping connection (REDIS_URL not set)');
}

module.exports = client;
