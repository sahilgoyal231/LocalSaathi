import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { PlusCircle, Wrench, Package, Clock, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRatingColor } from '../utils/ratingColors';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const { bookings, requests, quotations, hireProvider, addNotification, language, getProviderRating } = useData();
    const t = translations[language];

    const myRequests = requests.filter(r => r.userId === user.id);

    // Split bookings by status
    const myPendingBookings = bookings.filter(b => b.userId === user.id && b.status === 'pending');
    const myUpcomingBookings = bookings.filter(b => b.userId === user.id && b.status === 'accepted');
    const myCompletedBookings = bookings.filter(b => b.userId === user.id && b.status === 'completed');

    // Helper to count quotes for a request
    const getQuoteCount = (reqId) => quotations.filter(q => q.requestId === reqId).length;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>{t.welcome}, {user.name}!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your construction and service needs.</p>

            {/* Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card anim-slide-up stagger-1" style={{ textAlign: 'center' }}>
                    <Package size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h3>{t.requestMaterial}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>Get quotes from top shopkeepers.</p>
                    <Link to="/request-material" className="btn btn-primary btn-full">{t.startRequest}</Link>
                </div>

                <div className="card anim-slide-up stagger-2" style={{ textAlign: 'center' }}>
                    <Wrench size={48} color="var(--secondary-color)" style={{ marginBottom: '1rem' }} />
                    <h3>{t.bookService}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>Hire verified professionals.</p>
                    <Link to="/book-service" className="btn btn-primary btn-full" style={{ backgroundColor: 'var(--secondary-color)' }}>{t.findPro}</Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Pending Service Requests & Material Requests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 1. Pending Service Offers */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>Interested Professionals</h3>
                        </div>
                        {myPendingBookings.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No pending service requests.</p>
                        ) : (
                            <ul style={{ listStyle: 'none' }}>
                                {myPendingBookings.map((booking, idx) => (
                                    <li key={booking.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 + idx * 0.07}s both` }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{booking.serviceCategory}</strong>
                                            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({booking.description})</span>
                                        </div>

                                        {(!booking.interestedProviders || booking.interestedProviders.length === 0) ? (
                                            <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                Waiting for professionals to respond...
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                                {booking.interestedProviders.map(provider => (
                                                    <div key={provider.id} style={{
                                                        border: '1px solid var(--border-color)',
                                                        padding: '0.75rem',
                                                        borderRadius: '0.75rem',
                                                        background: 'var(--surface-color)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{provider.name}</div>
                                                                {provider.rating >= 4.0 && <ShieldCheck size={16} color="var(--success-color)" title="Top Rated Pro" />}
                                                            </div>
                                                            <div style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500, marginTop: '2px' }}>
                                                                {provider.skills || 'Professional Service'}
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', color: getRatingColor(provider.rating), fontWeight: 600 }}>
                                                                    <Star size={14} fill="currentColor" strokeWidth={0} style={{ marginRight: '4px' }} />
                                                                    {Number(provider.rating || 0).toFixed(1)}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{provider.experience || 0} Yrs Exp.</span>
                                                            </div>
                                                            <div style={{ marginTop: '0.85rem', fontSize: '0.95rem', background: 'var(--surface-highlight)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                                                    Estimated Cost {booking.contractDays > 1 ? `(${booking.contractDays} days)` : '(1 day)'}
                                                                </div>
                                                                <span style={{ color: 'var(--text-primary)' }}>₹{provider.proposedRate}</span><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/day</span>
                                                                <span style={{ margin: '0 0.4rem', color: 'var(--text-muted)' }}>•</span>
                                                                <span style={{ color: 'var(--text-primary)' }}>{provider.proposedTime}</span><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> hrs/day</span>
                                                                <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>=</span>
                                                                <span style={{ color: 'var(--success-color)', fontWeight: 700, fontSize: '1.1rem' }}>
                                                                    ₹{(parseFloat(provider.proposedRate) || 0) * (booking.contractDays || 1)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                hireProvider(booking.id, provider.id);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="btn btn-sm"
                                                            style={{ background: 'var(--secondary-color)', color: '#ffffff', padding: '0.75rem 1.5rem', alignSelf: 'center', whiteSpace: 'nowrap' }}
                                                        >
                                                            Hire Pro
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 2. Material Requests */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>{t.activeRequests} (Material)</h3>
                        </div>

                        {myRequests.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>{t.noactive}</p>
                        ) : (
                            <ul style={{ listStyle: 'none' }}>
                                {myRequests.map((req, idx) => (
                                    <li key={req.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 + idx * 0.07}s both` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{req.category}</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {getQuoteCount(req.id)} Quotes Received
                                                </div>
                                            </div>
                                            <Link to={`/request/${req.id}`} className="btn btn-outline btn-sm">{t.viewDetails}</Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Column: Upcoming & Completed Services */}
                <div>
                    {/* Upcoming */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'var(--secondary-color)' }}>Upcoming Services</h3>
                        </div>

                        {myUpcomingBookings.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No confirmed upcoming services.</p>
                        ) : (
                            <ul style={{ listStyle: 'none' }}>
                                {myUpcomingBookings.map(booking => (
                                    <li key={booking.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{booking.serviceCategory}</strong>
                                            <span className="badge badge-accepted">Confirmed</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <Clock size={14} /> {new Date(booking.date).toLocaleDateString()}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Pro: </span>
                                            {/* We might need to find the pro name, but sending it via ID is harder without a lookup. 
                                                For now we assume the ID is enough or we rely on the backend/context to hydrate it.
                                                Actually, we don't have the pro name easily available here unless we store it in the booking
                                                or look it up from users. 
                                                However, for now, let's just show the status.
                                             */}
                                            <span style={{ fontWeight: 500 }}>Assigned Professional</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Completed */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>Completed Services</h3>
                        </div>

                        {myCompletedBookings.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No completed services yet.</p>
                        ) : (
                            <ul style={{ listStyle: 'none' }}>
                                {myCompletedBookings.map(booking => (
                                    <li key={booking.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{booking.serviceCategory}</strong>
                                            <span className="badge badge-completed">Done</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <Clock size={14} /> {new Date(booking.date).toLocaleDateString()}
                                        </div>
                                        {!booking.feedback ? (
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <Link to={`/feedback/${booking.id}`} className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning-color)', borderColor: 'var(--warning-color)' }}>
                                                    <Star size={14} /> Leave Feedback & Earn Rewards!
                                                </Link>
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Star size={14} /> {booking.feedback.rating}/5 - You earned {booking.feedback.rewardEarned} pts
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerDashboard;
