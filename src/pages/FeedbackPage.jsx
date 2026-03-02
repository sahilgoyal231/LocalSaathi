import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Star, Gift, CheckCircle } from 'lucide-react';

const FeedbackPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bookings, addBookingFeedback } = useData();
    const { user, updateProfile } = useAuth();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [earnedReward, setEarnedReward] = useState(0);

    const booking = bookings.find(b => b.id === id);

    if (!booking) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Booking not found.</div>;
    }

    if (booking.feedback) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto 1rem' }} />
                <h2>Feedback Already Submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You have already received your reward points for this service.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Return to Dashboard</button>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please provide a rating out of 5 stars.');
            return;
        }

        // Calculate Reward Points (0.5% to 1.0% of the agreed price)
        const basePrice = booking.agreedPrice || 350;
        const multiplier = (Math.random() * (0.01 - 0.005) + 0.005); // Random between 0.005 and 0.010
        const points = Math.max(1, Math.round(basePrice * multiplier)); // At least 1 point

        setEarnedReward(points);

        addBookingFeedback(booking.id, {
            rating,
            comment,
            date: new Date().toISOString(),
            rewardEarned: points
        });

        const currentPoints = user.rewardPoints || 0;
        updateProfile({ rewardPoints: currentPoints + points });

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <div style={{ padding: '3rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Gift size={40} color="var(--success-color)" />
                    </div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--success-color)' }}>Thank You!</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your feedback helps us improve LocalSaathi.</p>
                    <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: '1px dashed var(--warning-color)' }}>
                        <h3 style={{ color: 'var(--warning-color)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Star size={20} fill="var(--warning-color)" /> Reward Unlocked!
                        </h3>
                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>You earned {earnedReward} Reward Points</p>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You can redeem these points for discounts on your future bookings!</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ width: '100%' }}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card anim-slide-up">
                <h2 style={{ marginBottom: '0.5rem' }}>Rate Your Service</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    How was your experience with <strong>{booking.serviceCategory}</strong>? Leave feedback to earn reward points!
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Overall Rating</label>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button
                                        type="button"
                                        key={starValue}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        <Star
                                            size={48}
                                            fill={(hover || rating) >= starValue ? "var(--warning-color)" : "transparent"}
                                            color={(hover || rating) >= starValue ? "var(--warning-color)" : "var(--border-color)"}
                                            style={{ transition: 'all 0.2s', transform: (hover || rating) >= starValue ? 'scale(1.1)' : 'scale(1)' }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Review details (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you liked or how we can improve..."
                            rows="5"
                        />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            Submit Feedback & Claim Reward
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
