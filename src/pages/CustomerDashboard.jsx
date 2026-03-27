import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { Wrench, Package, Clock, Star, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRatingColor } from '../utils/ratingColors';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const { bookings, requests, quotations, hireProvider, addNotification, language, getProviderRating } = useData();
    const t = translations[language];

    const myRequests = requests.filter(r =>
        r.userId === user.id &&
        !quotations.some(q => q.requestId === r.id && q.status === 'completed')
    );

    const myPendingBookings = bookings.filter(b => b.userId === user.id && b.status === 'pending');
    const myUpcomingBookings = bookings.filter(b => b.userId === user.id && b.status === 'accepted');
    const myCompletedBookings = bookings.filter(b => b.userId === user.id && b.status === 'completed');

    const myCompletedMaterialOrders = quotations.filter(q =>
        q.status === 'completed' &&
        requests.some(r => r.id === q.requestId && r.userId === user.id)
    );
    const myAcceptedMaterialOrders = quotations.filter(q =>
        q.status === 'accepted' &&
        requests.some(r => r.id === q.requestId && r.userId === user.id)
    );

    const getQuoteCount = (reqId) => quotations.filter(q => q.requestId === reqId).length;

    return (
        <div style={{ background: 'var(--background-color)', minHeight: 'calc(100vh - 64px)' }}>
            {/* Hero Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
                padding: '2.5rem 0',
                marginBottom: '2rem'
            }}>
                <div className="container">
                    <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {t.welcome}, {user.name}! 👋
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
                        Manage your construction and service needs — all in one place.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {/* Action Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="card anim-slide-up stagger-1" style={{
                        textAlign: 'center', padding: '2rem 1.5rem',
                        borderTop: '4px solid var(--primary-color)',
                        borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px',
                            background: 'var(--primary-light)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                        }}>
                            <Package size={28} color="var(--primary-color)" />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.requestMaterial}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Get competitive quotes from verified shopkeepers near you.
                        </p>
                        <Link to="/request-material" className="btn btn-primary btn-full" style={{ borderRadius: '12px', padding: '0.75rem' }}>
                            {t.startRequest} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="card anim-slide-up stagger-2" style={{
                        textAlign: 'center', padding: '2rem 1.5rem',
                        borderTop: '4px solid var(--secondary-color)',
                        borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px',
                            background: 'var(--warning-muted)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                        }}>
                            <Wrench size={28} color="var(--secondary-color)" />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.bookService}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Hire verified electricians, plumbers, carpenters & more.
                        </p>
                        <Link to="/book-service" className="btn btn-full" style={{
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: '#FFFFFF', borderRadius: '12px', padding: '0.75rem',
                            border: 'none', boxShadow: '0 2px 8px rgba(245,158,11,0.25)'
                        }}>
                            {t.findPro} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>

                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Pending Service Offers */}
                        <div className="card" style={{ borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={20} color="var(--primary-color)" />
                                    Interested Professionals
                                </h3>
                                <span className="badge badge-open">{myPendingBookings.length}</span>
                            </div>
                            {myPendingBookings.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '2rem 1rem',
                                    background: 'var(--surface-raised)', borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending service requests.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myPendingBookings.map((booking, idx) => (
                                        <div key={booking.id} style={{
                                            padding: '1rem', borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--surface-raised)',
                                            animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 + idx * 0.07}s both`
                                        }}>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{booking.serviceCategory}</strong>
                                                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>({booking.description})</span>
                                            </div>

                                            {(!booking.interestedProviders || booking.interestedProviders.length === 0) ? (
                                                <div style={{
                                                    padding: '0.75rem', background: '#FFFFFF',
                                                    borderRadius: '8px', color: 'var(--text-muted)',
                                                    fontStyle: 'italic', fontSize: '0.9rem',
                                                    border: '1px dashed var(--border-color)'
                                                }}>
                                                    ⏳ Waiting for professionals to respond...
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {booking.interestedProviders.map(provider => (
                                                        <div key={provider.id} style={{
                                                            border: '1px solid var(--border-color)',
                                                            padding: '1rem',
                                                            borderRadius: '12px',
                                                            background: '#FFFFFF',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: '1rem'
                                                        }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{provider.name}</div>
                                                                    {provider.rating >= 4.0 && <ShieldCheck size={16} color="var(--success-color)" title="Top Rated Pro" />}
                                                                </div>
                                                                <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 500, marginTop: '2px' }}>
                                                                    {provider.skills || 'Professional Service'}
                                                                </div>

                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', color: getRatingColor(provider.rating), fontWeight: 600 }}>
                                                                        <Star size={14} fill="currentColor" strokeWidth={0} style={{ marginRight: '4px' }} />
                                                                        {Number(provider.rating || 0).toFixed(1)}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span>{provider.experience || 0} Yrs Exp.</span>
                                                                </div>
                                                                <div style={{
                                                                    marginTop: '0.75rem', fontSize: '0.9rem',
                                                                    background: 'var(--surface-raised)',
                                                                    padding: '0.5rem 0.75rem', borderRadius: '8px',
                                                                    display: 'inline-block', border: '1px solid var(--border-color)'
                                                                }}>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                                                                        Estimated Cost {booking.contractDays > 1 ? `(${booking.contractDays} days)` : '(1 day)'}
                                                                    </div>
                                                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{provider.proposedRate}</span><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/day</span>
                                                                    <span style={{ margin: '0 0.4rem', color: 'var(--text-muted)' }}>•</span>
                                                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{provider.proposedTime}</span><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> hrs/day</span>
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
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                                                    color: '#ffffff', padding: '0.65rem 1.25rem',
                                                                    alignSelf: 'center', whiteSpace: 'nowrap',
                                                                    borderRadius: '10px', border: 'none',
                                                                    boxShadow: '0 2px 6px rgba(245,158,11,0.3)',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Hire Pro
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Material Requests */}
                        <div className="card" style={{ borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={20} color="var(--primary-color)" />
                                    {t.activeRequests} (Material)
                                </h3>
                                <span className="badge badge-open">{myRequests.length}</span>
                            </div>

                            {myRequests.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '2rem 1rem',
                                    background: 'var(--surface-raised)', borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.noactive}</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {myRequests.map((req, idx) => (
                                        <div key={req.id} style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#FFFFFF',
                                            animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 + idx * 0.07}s both`
                                        }}>
                                            <div>
                                                <strong style={{ textTransform: 'capitalize' }}>{req.category}</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {getQuoteCount(req.id)} Quotes Received
                                                </div>
                                            </div>
                                            <Link to={`/request/${req.id}`} className="btn btn-outline btn-sm">{t.viewDetails}</Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Upcoming */}
                        <div className="card" style={{ borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)' }}>
                                    <Clock size={20} />
                                    Upcoming Services
                                </h3>
                            </div>

                            {myUpcomingBookings.length === 0 && myAcceptedMaterialOrders.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '2rem 1rem',
                                    background: 'var(--surface-raised)', borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No confirmed upcoming services.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {myUpcomingBookings.map(booking => (
                                        <div key={booking.id} style={{
                                            padding: '0.75rem 1rem', borderRadius: '10px',
                                            border: '1px solid var(--border-color)', background: '#FFFFFF'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <strong>{booking.serviceCategory}</strong>
                                                <span className="badge badge-accepted">Confirmed</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <Clock size={14} /> {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                            <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Pro: </span>
                                                <span style={{ fontWeight: 500 }}>Assigned Professional</span>
                                            </div>
                                        </div>
                                    ))}
                                    {myAcceptedMaterialOrders.map(order => {
                                        const req = requests.find(r => r.id === order.requestId);
                                        return (
                                            <div key={`mat-up-${order.id}`} style={{
                                                padding: '0.75rem 1rem', borderRadius: '10px',
                                                border: '1px solid var(--border-color)', background: '#FFFFFF'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <strong style={{ textTransform: 'capitalize' }}>{req?.category || 'Material Order'}</strong>
                                                    <span className="badge badge-accepted">Order Confirmed</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                                                </div>
                                                <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'var(--text-muted)' }}>Shop: </span>
                                                    <span style={{ fontWeight: 500 }}>{order.shopkeeperName}</span>
                                                    <span style={{ margin: '0 0.5rem', color: 'var(--border-hover)' }}>|</span>
                                                    <span style={{ color: 'var(--text-muted)' }}>Amount: </span>
                                                    <span style={{ fontWeight: 600 }}>₹{order.totalAmount || order.amount}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Completed */}
                        <div className="card" style={{ borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={20} color="var(--success-color)" />
                                    Completed Services
                                </h3>
                            </div>

                            {myCompletedBookings.length === 0 && myCompletedMaterialOrders.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '2rem 1rem',
                                    background: 'var(--surface-raised)', borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No completed services or orders yet.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {myCompletedBookings.map(booking => (
                                        <div key={booking.id} style={{
                                            padding: '0.75rem 1rem', borderRadius: '10px',
                                            border: '1px solid var(--border-color)', background: '#FFFFFF'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <strong>{booking.serviceCategory}</strong>
                                                <span className="badge badge-completed">Done</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <Clock size={14} /> {new Date(booking.date).toLocaleDateString()}
                                            </div>
                                            {!booking.feedback ? (
                                                <div style={{ marginTop: '0.75rem' }}>
                                                    <Link to={`/feedback/${booking.id}`} className="btn btn-sm btn-outline" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                        color: 'var(--warning-color)', borderColor: 'var(--warning-color)'
                                                    }}>
                                                        <Star size={14} /> Leave Feedback & Earn Rewards!
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                                                    <Star size={14} /> {booking.feedback.rating}/5 — You earned {booking.feedback.rewardEarned} pts
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {myCompletedMaterialOrders.map(order => {
                                        const req = requests.find(r => r.id === order.requestId);
                                        return (
                                            <div key={`mat-${order.id}`} style={{
                                                padding: '0.75rem 1rem', borderRadius: '10px',
                                                border: '1px solid var(--border-color)', background: '#FFFFFF'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <strong style={{ textTransform: 'capitalize' }}>{req?.category || 'Material Order'}</strong>
                                                    <span className="badge badge-completed">Completed</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                                                </div>
                                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'var(--text-muted)' }}>Shop: </span>
                                                    <span style={{ fontWeight: 500 }}>{order.shopkeeperName}</span>
                                                    <span style={{ margin: '0 0.5rem', color: 'var(--border-hover)' }}>|</span>
                                                    <span style={{ color: 'var(--text-muted)' }}>Amount: </span>
                                                    <span style={{ fontWeight: 600 }}>₹{order.totalAmount || order.amount}</span>
                                                </div>
                                                {!order.feedback ? (
                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <Link to={`/order-feedback/${order.id}`} className="btn btn-sm btn-outline" style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                            color: 'var(--warning-color)', borderColor: 'var(--warning-color)'
                                                        }}>
                                                            <Star size={14} /> Leave Feedback & Earn Rewards!
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                                                        <Star size={14} /> {order.feedback.rating}/5 — You earned {order.feedback.rewardEarned} pts
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
