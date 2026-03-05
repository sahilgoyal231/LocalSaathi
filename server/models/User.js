const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        sparse: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'customer', 'serviceman', 'admin', 'shopkeeper'],
        default: 'customer',
    },
    // Additional fields for Servicemen
    serviceType: {
        type: String,
        required: function () { return this.role === 'serviceman'; }
    },
    experience: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    contact: {
        type: String,
        sparse: true,
        unique: true
    },
    address: { type: String, default: '' },
    skills: { type: String, default: '' },
    rates: { type: String, default: '' },
    serviceArea: { type: String, default: '' },
    availability: { type: String, default: '' },
    shopName: { type: String, default: '' },
    shopAddress: { type: String, default: '' },
    businessRegistration: { type: String, default: '' },
    deliveryRadius: { type: String, default: '' },
    rewardPoints: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 },
    skillVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0.0 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
