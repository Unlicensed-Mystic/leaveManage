const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const seedUsers = [
    {
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        department: 'IT',
    },
    {
        name: 'Sarah Manager',
        email: 'manager@company.com',
        password: 'manager123',
        role: 'manager',
        department: 'Engineering',
    },
    {
        name: 'John Employee',
        email: 'employee@company.com',
        password: 'employee123',
        role: 'employee',
        department: 'Engineering',
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany();
        console.log('Cleared existing users');

        for (const userData of seedUsers) {
            await User.create(userData);
            console.log(`✅ Created: ${userData.email} (${userData.role})`);
        }

        console.log('\n🎉 Seed complete! Use these credentials to log in:');
        console.log('  Admin    → admin@company.com     / admin123');
        console.log('  Manager  → manager@company.com   / manager123');
        console.log('  Employee → employee@company.com  / employee123');

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
