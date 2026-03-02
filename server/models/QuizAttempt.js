const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Ensure a user has only one attempt tracking document per profile
quizAttemptSchema.index({ identifier: 1, profile: 1 }, { unique: true });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
