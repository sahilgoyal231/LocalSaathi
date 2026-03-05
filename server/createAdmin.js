const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB().then(async () => {
    try {
        const adminEmail = 'admin@localsaathi.com';
        const passwordText = 'SecureAdmin123!';

        // Check if admin exists
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            // Create new admin
            adminUser = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: passwordText,
                role: 'admin',
                contact: '0000000000'
            });
            console.log('\n✅ Admin account created successfully!');
            console.log('----------------------------------------');
            console.log('Email:    ' + adminEmail);
            console.log('Password: ' + passwordText);
            console.log('----------------------------------------\n');
        } else {
            // Update existing admin password
            adminUser.password = passwordText;
            adminUser.role = 'admin'; // ensure role
            await adminUser.save();
            console.log('\n✅ Admin account reset successfully!');
            console.log('----------------------------------------');
            console.log('Email:    ' + adminEmail);
            console.log('Password: ' + passwordText);
            console.log('----------------------------------------\n');
        } // Save admin

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
});
