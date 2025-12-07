const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Support both MONGO_URI and MONGO_URL (Railway uses MONGO_URL)
        const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

        if (!mongoUri) {
            throw new Error('MongoDB connection string not found. Set MONGO_URI or MONGO_URL environment variable.');
        }

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
