import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, Search, Trash2, Calendar, MapPin } from 'lucide-react'; // Added icons
import { useState } from 'react';
import { serviceThemes } from '../utils/serviceThemes';

const ServicemanDashboard = () => {
    const { user } = useAuth();
    const { bookings, updateBookingStatus, expressInterest, language, getProviderRating } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBookingForInterest, setSelectedBookingForInterest] = useState(null);
    const [proposedRate, setProposedRate] = useState('');
    const [proposedTime, setProposedTime] = useState('');
    const t = translations[language];

    const theme = serviceThemes[user.skills] || serviceThemes['default'];

    // Filter bookings: 
    // 1. Pending bookings matching serviceman's skill
    // 2. My accepted bookings

    const availableJobs = bookings.filter(b =>
        b.status === 'pending' &&
        user.skills &&
        b.serviceCategory.toLowerCase() === user.skills.toLowerCase() &&
        (b.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) || b.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const myJobs = bookings.filter(b => b.servicemanId === user.id);

    const handleExpressInterest = (e) => {
        e.preventDefault();
        if (!selectedBookingForInterest) return;

        expressInterest(selectedBookingForInterest.id, {
            id: user.id,
            name: user.name,
            rating: user.rating || 4.8,
            experience: user.experience || 5,
            proposedRate: proposedRate || user.hourlyRate || 350,
            proposedTime: proposedTime || 'Standard Service Time'
        });

        setSelectedBookingForInterest(null);
        setProposedRate('');
        setProposedTime('');
    };

    const handleComplete = (bookingId) => {
        updateBookingStatus(bookingId, 'completed', user.id);
    };

    const handleResetData = () => {
        if (window.confirm("Are you sure? This will delete all jobs and reset the app.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const glassCard = {
        background: 'rgba(17,24,39,0.90)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${theme.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: 'calc(100vh - 64px)',
            backgroundImage: `url(${theme.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            {/* Full-page dark + category-tinted overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(160deg, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.72) 50%, ${theme.accent} 100%)`,
                zIndex: 0,
            }} />

            {/* Content above overlay */}
            <div style={{ position: 'relative', zIndex: 1, padding: '2rem 1rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{t.welcome}, {user.name}!</h1>
                        <p style={{ color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 4px rgba(0,0,0,0.4)', fontSize: '0.9rem' }}>{user.skills || 'Pro'} · LocalSaathi</p>

                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!user.skillVerified && (
                            <Link to="/skill-quiz" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '1rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)' }}>{t.verifySkills}</Link>
                        )}
                        <Link to="/profile" className="btn btn-outline" style={{ padding: '0.65rem 1.4rem', fontSize: '1rem', fontWeight: '600', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)' }}>{t.profile}</Link>
                    </div>
                </div>

                {/* Express Interest Modal */}
                {selectedBookingForInterest && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
                            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Propose Terms</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Set your expected price and estimated time required for this job. This will be sent to the customer.</p>

                            <form onSubmit={handleExpressInterest}>
                                <div className="form-group">
                                    <label>Proposed Rate / Price (₹)</label>
                                    <input
                                        type="number"
                                        value={proposedRate}
                                        onChange={(e) => setProposedRate(e.target.value)}
                                        placeholder={`e.g. ${user.hourlyRate || 350}`}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estimated Time / Duration</label>
                                    <input
                                        type="text"
                                        value={proposedTime}
                                        onChange={(e) => setProposedTime(e.target.value)}
                                        placeholder="e.g. 2 hours, Half Day"
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setSelectedBookingForInterest(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Proposal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${theme.primary}` }} className="anim-slide-up stagger-1">
                        <div style={{ padding: '10px', background: theme.accent, borderRadius: '50%' }}>
                            <Briefcase size={24} color={theme.primary} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff' }}>{availableJobs.length}</h3>
                            <small style={{ color: 'rgba(255,255,255,0.55)' }}>New Jobs</small>
                        </div>
                    </div>
                    <div style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-color)' }} className="anim-slide-up stagger-2">
                        <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%' }}>
                            <Clock size={24} color="var(--accent-color)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff' }}>{myJobs.filter(j => j.status === 'accepted').length}</h3>
                            <small style={{ color: 'rgba(255,255,255,0.55)' }}>Active</small>
                        </div>
                    </div>
                    <div style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--success-color)' }} className="anim-slide-up stagger-3">
                        <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%' }}>
                            <CheckCircle size={24} color="var(--success-color)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff' }}>{myJobs.filter(j => j.status === 'completed').length}</h3>
                            <small style={{ color: 'rgba(255,255,255,0.55)' }}>Done</small>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                    {/* Available Jobs */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: theme.secondary, display: 'flex', alignItems: 'center', gap: '0.5rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            <Briefcase size={20} /> {t.jobBoard}
                        </h3>

                        {availableJobs.length === 0 ? (
                            <div style={{ ...glassCard, textAlign: 'center', padding: '3rem 1rem', opacity: 0.85 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                                <p>{t.noactive}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {availableJobs.map((job, idx) => (
                                    <div key={job.id} style={{ ...glassCard, position: 'relative', overflow: 'hidden', animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.1 + idx * 0.08}s both` }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.25rem 0.75rem', background: theme.accent, color: theme.primary, fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '0.5rem' }}>
                                            NEW
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{
                                                width: '50px', height: '50px',
                                                background: theme.accent,
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Briefcase size={24} color={theme.primary} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 0.25rem', textTransform: 'capitalize' }}>{job.serviceCategory}</h4>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                                    {job.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                                    <Calendar size={14} /> {job.preferredDate}
                                                    <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }} />
                                                    <Clock size={14} /> {job.preferredTime}
                                                </div>

                                                {job.interestedProviders?.find(p => p.id === user.id) ? (
                                                    <button disabled className="btn btn-full" style={{ background: '#e5e7eb', color: '#6b7280', border: 'none', cursor: 'not-allowed' }}>
                                                        Interest Sent ✓
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setSelectedBookingForInterest(job)} className="btn btn-full" style={{ background: theme.buttonGradient, color: '#ffffff', border: 'none' }}>
                                                        Express Interest
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Jobs */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: theme.secondary, display: 'flex', alignItems: 'center', gap: '0.5rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            <Clock size={20} /> {t.myJobs}
                        </h3>

                        {myJobs.filter(j => j.status === 'accepted').length === 0 ? (
                            <div style={{ ...glassCard, textAlign: 'center', padding: '3rem 1rem', opacity: 0.85 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>☕</div>
                                <p>No active jobs. Relax!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {myJobs.filter(j => j.status === 'accepted').map(job => (
                                    <div key={job.id} style={{ ...glassCard, borderLeft: '4px solid var(--accent-color)' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{
                                                width: '50px', height: '50px',
                                                background: 'rgba(245, 158, 11, 0.15)',
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Clock size={24} color="var(--accent-color)" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 0.25rem', textTransform: 'capitalize' }}>{job.serviceCategory}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <span className="badge badge-pending">In Progress</span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                                    <MapPin size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Customer: {job.userName}
                                                </p>
                                                <Link
                                                    to={`/job/${job.id}`}
                                                    className="btn btn-outline btn-full"
                                                    style={{
                                                        borderColor: 'var(--success-color)',
                                                        color: 'var(--success-color)',
                                                        justifyContent: 'center',
                                                        padding: '0.75rem',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        borderWidth: '2px'
                                                    }}
                                                >
                                                    View & Complete
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Performance & Status */}
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1.25rem', color: '#fff', fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Performance &amp; Status</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

                        {/* Status card */}
                        <div style={{ ...glassCard, borderLeft: '3px solid var(--primary-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={18} color="var(--primary-color)" />
                                </div>
                                <h4 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
                                    {user.skillVerified ? 'Verified Expert' : 'Pending Verification'}
                                </h4>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {user.skillVerified ? 'You are a certified professional on LocalSaathi.' : 'Complete the skill quiz to get verified.'}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className="badge badge-success">🏆 Top Rated</span>
                                <span className="badge badge-open">⚡ Quick Responder</span>
                            </div>
                        </div>

                        {/* Rating card */}
                        <div style={{ ...glassCard, borderLeft: '3px solid var(--warning-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--warning-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1rem' }}>⭐</span>
                                </div>
                                <h4 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Customer Rating</h4>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning-color)', lineHeight: 1 }}>
                                {getProviderRating(user.id)}
                                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>&nbsp;/ 5.0</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Based on completed jobs</p>
                        </div>

                        {/* Jobs summary card */}
                        <div style={{ ...glassCard, borderLeft: '3px solid var(--success-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--success-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Briefcase size={18} color="var(--success-color)" />
                                </div>
                                <h4 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Jobs Completed</h4>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-color)', lineHeight: 1 }}>
                                {myJobs.filter(j => j.status === 'completed').length}
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 400 }}>&nbsp;total</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Keep it up! 🚀</p>
                        </div>

                    </div>
                </div>

                {/* Reset Data Button (For Demo/Cleanup) */}
                <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', pt: '2rem' }}>
                    <button
                        onClick={handleResetData}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            textDecoration: 'underline',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            margin: '0 auto'
                        }}
                    >
                        <Trash2 size={14} /> Reset App Data (Clear Cache)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServicemanDashboard;
