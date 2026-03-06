const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const jwt = require('jsonwebtoken');
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
    const { name, identifier, password, role, shopName, gst, skills } = req.body;

    try {
        const isEmail = identifier.includes('@');
        let email = isEmail ? identifier : undefined;
        let contact = !isEmail ? identifier : undefined;

        // Security Validation: Prevent unauthorized admin creation
        let assignedRole = role;
        if (assignedRole === 'admin') {
            return res.status(403).json({ message: 'Unauthorized role assignment. Admin accounts must be created manually.' });
        }
        if (!['user', 'customer', 'serviceman', 'shopkeeper'].includes(assignedRole)) {
            assignedRole = 'customer'; // Default fallback
        }

        // Check if user has exceeded quiz attempts for this specific profile
        if (assignedRole === 'serviceman') {
            const quizAttempt = await QuizAttempt.findOne({ identifier, profile: skills });
            if (quizAttempt && quizAttempt.attempts >= 3) {
                return res.status(400).json({ message: 'Maximum 3 attempts reached for this profile. You cannot register.' });
            }
        }

        const userExists = await User.findOne({
            $or: [
                { email: identifier },
                { contact: identifier }
            ]
        });

        // If user exists, but they are an unverified serviceman, we allow them to overwrite and retry!
        let user;
        if (userExists) {
            if (userExists.role === 'serviceman' && userExists.skillVerified === false) {
                // Allows overwriting the previous unverified attempt completely
                userExists.name = name;
                userExists.password = password; // Will be hashed by pre-save
                userExists.skills = skills || '';
                userExists.serviceType = skills || 'General';
                user = await userExists.save();
            } else {
                return res.status(400).json({ message: 'User already exists with this email or mobile number.' });
            }
        } else {
            // New user branch
            user = await User.create({
                name,
                email,
                contact,
                password,
                role: assignedRole,
                shopName: shopName || '',
                businessRegistration: gst || '',
                skills: skills || '',
                serviceType: skills || 'General',
                experience: parseInt(req.body.experience) || 0,
            });
        }

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
        console.error(error); res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { contact: identifier }
            ]
        });

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
        console.error(error); res.status(500).json({ message: error.message });
    }
});


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

            if (req.body.skillVerified !== undefined) {
                user.skillVerified = req.body.skillVerified;

                // If they explicitly failed the skill verification, record the attempt
                if (req.body.skillVerified === false && user.role === 'serviceman') {
                    const identifier = user.email || user.contact;
                    if (identifier) {
                        try {
                            await QuizAttempt.findOneAndUpdate(
                                { identifier, profile: user.skills },
                                { $inc: { attempts: 1 } },
                                { upsert: true, new: true }
                            );
                        } catch (err) {
                            console.error('Failed to record quiz attempt:', err);
                        }
                    }
                }
            }

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
        console.error(error); res.status(500).json({ message: error.message });
    }
});

module.exports = router;
