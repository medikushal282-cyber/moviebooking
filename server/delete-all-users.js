const mongoose = require('mongoose');
const User = require('./src/models/User');
const PendingUser = require('./src/models/PendingUser');
require('dotenv').config();

const deleteAllUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Delete all Users
        const userResult = await User.deleteMany({});
        console.log(`\n🗑️ Deleted ${userResult.deletedCount} users from 'User' collection.`);

        // Delete all Pending Users
        const pendingResult = await PendingUser.deleteMany({});
        console.log(`🗑️ Deleted ${pendingResult.deletedCount} pending users from 'PendingUser' collection.`);

        console.log('\n✨ All users have been removed successfully.');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteAllUsers();
