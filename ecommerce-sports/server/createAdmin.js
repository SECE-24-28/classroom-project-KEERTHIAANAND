require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@sportzone.com' });

        if (existingAdmin) {
            // Update to admin role
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Updated existing user to admin role!');
            console.log('Admin:', {
                name: existingAdmin.name,
                email: existingAdmin.email,
                role: existingAdmin.role
            });
        } else {
            // Create new admin
            const admin = await User.create({
                name: 'Admin User',
                email: 'admin@sportzone.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created!');
            console.log('Admin:', {
                name: admin.name,
                email: admin.email,
                role: admin.role
            });
        }

        await mongoose.disconnect();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
