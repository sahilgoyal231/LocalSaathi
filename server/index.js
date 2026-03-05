const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Standard Middleware (Must be parsed FIRST)
app.use(express.json());
app.use(cors());

// Security Middleware
app.use(helmet()); // Set security headers

// Custom NoSQL & XSS Sanitizer
app.use((req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            // 1. Prevent NoSQL Injection (remove keys starting with $)
            if (key.startsWith('$') || key.includes('.')) {
                delete req.body[key];
                return;
            }
            // 2. Prevent XSS (sanitize HTML from strings)
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key], {
                    allowedTags: [], // Strip ALL tags
                    allowedAttributes: {}
                });
            }
        });
    }
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // 100 requests per 10 mins
});
app.use('/api/', limiter);


// Database Connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('LocalSaathi API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/services', serviceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
