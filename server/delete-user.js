const mongoose = require('mongoose');
const User = require('./src/models/User');
const PendingUser = require('./src/models/PendingUser');
require('dotenv').config();

const deleteUser = async () => {
    try {
        const email = process.argv[2];

        if (!email) {
            console.log('❌ Please provide an email address.');
            console.log('Usage: node delete-user.js <email>');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Check and delete from User collection
        const user = await User.findOne({ email });
        if (user) {
            await User.deleteOne({ email });
            console.log(`\n🗑️ User '${email}' deleted from 'User' collection.`);
        } else {
            console.log(`\n⚠️ User '${email}' not found in 'User' collection.`);
        }

        // Check and delete from PendingUser collection
        const pendingUser = await PendingUser.findOne({ email });
        if (pendingUser) {
            await PendingUser.deleteOne({ email });
            console.log(`🗑️ User '${email}' deleted from 'PendingUser' collection.`);
        } else {
            console.log(`⚠️ User '${email}' not found in 'PendingUser' collection.`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteUser();
