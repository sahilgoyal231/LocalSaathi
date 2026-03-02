const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role, shopName, gst, skills } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            shopName: shopName || '',
            businessRegistration: gst || '',
            skills: skills || '',
            serviceType: skills || 'General',
        });

        if (user) {
            const userRes = user.toObject();
            delete userRes.password;
            userRes.token = generateToken(user._id);
            userRes.id = user._id;
            res.status(201).json(userRes);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const userRes = user.toObject();
            delete userRes.password;
            userRes.token = generateToken(user._id);
            userRes.id = user._id;
            res.json(userRes);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.contact = req.body.contact || user.contact;
            user.address = req.body.address || user.address;
            user.skills = req.body.skills || user.skills;
            user.rates = req.body.rates || user.rates;
            user.serviceArea = req.body.serviceArea || user.serviceArea;
            user.availability = req.body.availability || user.availability;
            user.shopName = req.body.shopName || user.shopName;
            user.shopAddress = req.body.shopAddress || user.shopAddress;
            user.businessRegistration = req.body.businessRegistration || user.businessRegistration;
            user.deliveryRadius = req.body.deliveryRadius || user.deliveryRadius;

            if (req.body.rewardPoints !== undefined) user.rewardPoints = req.body.rewardPoints;
            if (req.body.quizScore !== undefined) user.quizScore = req.body.quizScore;
            if (req.body.skillVerified !== undefined) user.skillVerified = req.body.skillVerified;
            if (req.body.rating !== undefined) user.rating = req.body.rating;
            if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            const userRes = updatedUser.toObject();
            delete userRes.password;
            userRes.token = generateToken(updatedUser._id);
            userRes.id = updatedUser._id;

            res.json(userRes);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
