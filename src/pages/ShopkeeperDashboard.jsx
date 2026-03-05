import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, CheckCircle, Search } from 'lucide-react'; // Added Search icon
import { useState } from 'react';

const ShopkeeperDashboard = () => {
    const { user } = useAuth();
    const { requests, quotations, language, completeOrder, getShopkeeperRating, getShopkeeperPoints } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const t = translations[language];

    // Filter queries
    const materialRequests = requests.filter(r =>
        r.type === 'material' &&
        r.status === 'open' &&
        (r.category.toLowerCase().includes(searchTerm.toLowerCase()) || r.requirements.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const myQuotations = quotations.filter(q => q.shopkeeperId === user.id);
    // Mock orders: accepted quotations are considered "orders"
    const myOrders = quotations.filter(q => q.shopkeeperId === user.id && q.status === 'accepted');

    const handleStatusUpdate = (quoteId, newStatus) => {
        alert(`Order status updated to: ${newStatus}`);
    };

    // ── Tier system — 12 levels (3 per tier) ──────────────────────────────
    // Color intensity increases with each level: dim → medium → vivid
    // Every rating received (positive or negative) grants 10 pts
    const LIVE_POINTS = getShopkeeperPoints(user.id);

    const tierLevels = [
        // Bronze I — muted warm copper
        {
            key: 'Bronze-I', tier: 'Bronze', level: 1, min: 0, max: 149, next: 'Bronze-II', nextPts: 150,
            emoji: '🥉', roman: 'I',
            color: '#8B5A2B', glow: 'rgba(139,90,43,0.20)',
            gradient: 'linear-gradient(135deg, rgba(139,90,43,0.12) 0%, rgba(139,90,43,0.04) 100%)',
            border: 'rgba(139,90,43,0.45)', bar: '#8B5A2B', shadow: '0 0 10px rgba(139,90,43,0.18)'
        },
        // Bronze II — classic bronze
        {
            key: 'Bronze-II', tier: 'Bronze', level: 2, min: 150, max: 299, next: 'Bronze-III', nextPts: 300,
            emoji: '🥉', roman: 'II',
            color: '#CD7F32', glow: 'rgba(205,127,50,0.28)',
            gradient: 'linear-gradient(135deg, rgba(205,127,50,0.16) 0%, rgba(205,127,50,0.06) 100%)',
            border: 'rgba(205,127,50,0.55)', bar: '#CD7F32', shadow: '0 0 14px rgba(205,127,50,0.28)'
        },
        // Bronze III — vivid sharp copper
        {
            key: 'Bronze-III', tier: 'Bronze', level: 3, min: 300, max: 499, next: 'Silver-I', nextPts: 500,
            emoji: '🥉', roman: 'III',
            color: '#E8930A', glow: 'rgba(232,147,10,0.40)',
            gradient: 'linear-gradient(135deg, rgba(232,147,10,0.22) 0%, rgba(232,147,10,0.08) 100%)',
            border: 'rgba(232,147,10,0.70)', bar: '#E8930A', shadow: '0 0 20px rgba(232,147,10,0.40)'
        },

        // Silver I — muted steel
        {
            key: 'Silver-I', tier: 'Silver', level: 1, min: 500, max: 649, next: 'Silver-II', nextPts: 650,
            emoji: '🥈', roman: 'I',
            color: '#7A7A7A', glow: 'rgba(122,122,122,0.20)',
            gradient: 'linear-gradient(135deg, rgba(122,122,122,0.12) 0%, rgba(122,122,122,0.04) 100%)',
            border: 'rgba(122,122,122,0.45)', bar: '#7A7A7A', shadow: '0 0 10px rgba(122,122,122,0.18)'
        },
        // Silver II — classic silver
        {
            key: 'Silver-II', tier: 'Silver', level: 2, min: 650, max: 799, next: 'Silver-III', nextPts: 800,
            emoji: '🥈', roman: 'II',
            color: '#A8A9AD', glow: 'rgba(168,169,173,0.28)',
            gradient: 'linear-gradient(135deg, rgba(168,169,173,0.16) 0%, rgba(168,169,173,0.06) 100%)',
            border: 'rgba(168,169,173,0.55)', bar: '#A8A9AD', shadow: '0 0 14px rgba(168,169,173,0.28)'
        },
        // Silver III — bright polished silver
        {
            key: 'Silver-III', tier: 'Silver', level: 3, min: 800, max: 999, next: 'Gold-I', nextPts: 1000,
            emoji: '🥈', roman: 'III',
            color: '#D0D2D8', glow: 'rgba(208,210,216,0.42)',
            gradient: 'linear-gradient(135deg, rgba(208,210,216,0.22) 0%, rgba(208,210,216,0.08) 100%)',
            border: 'rgba(208,210,216,0.72)', bar: '#D0D2D8', shadow: '0 0 20px rgba(208,210,216,0.40)'
        },

        // Gold I — muted dark gold
        {
            key: 'Gold-I', tier: 'Gold', level: 1, min: 1000, max: 1499, next: 'Gold-II', nextPts: 1500,
            emoji: '🥇', roman: 'I',
            color: '#B8930A', glow: 'rgba(184,147,10,0.22)',
            gradient: 'linear-gradient(135deg, rgba(184,147,10,0.14) 0%, rgba(184,147,10,0.05) 100%)',
            border: 'rgba(184,147,10,0.50)', bar: '#B8930A', shadow: '0 0 12px rgba(184,147,10,0.22)'
        },
        // Gold II — classic bright gold
        {
            key: 'Gold-II', tier: 'Gold', level: 2, min: 1500, max: 1999, next: 'Gold-III', nextPts: 2000,
            emoji: '🥇', roman: 'II',
            color: '#F5C518', glow: 'rgba(245,197,24,0.35)',
            gradient: 'linear-gradient(135deg, rgba(245,197,24,0.20) 0%, rgba(245,197,24,0.08) 100%)',
            border: 'rgba(245,197,24,0.65)', bar: '#F5C518', shadow: '0 0 18px rgba(245,197,24,0.35)'
        },
        // Gold III — vivid royal gold
        {
            key: 'Gold-III', tier: 'Gold', level: 3, min: 2000, max: 2499, next: 'Platinum-I', nextPts: 2500,
            emoji: '🥇', roman: 'III',
            color: '#FFD700', glow: 'rgba(255,215,0,0.50)',
            gradient: 'linear-gradient(135deg, rgba(255,215,0,0.26) 0%, rgba(255,215,0,0.10) 100%)',
            border: 'rgba(255,215,0,0.80)', bar: '#FFD700', shadow: '0 0 26px rgba(255,215,0,0.50)'
        },

        // Platinum I — muted steel-platinum
        {
            key: 'Platinum-I', tier: 'Platinum', level: 1, min: 2500, max: 2999, next: 'Platinum-II', nextPts: 3000,
            emoji: '💎', roman: 'I',
            color: '#9BA3AF', glow: 'rgba(155,163,175,0.22)',
            gradient: 'linear-gradient(135deg, rgba(155,163,175,0.14) 0%, rgba(155,163,175,0.05) 100%)',
            border: 'rgba(155,163,175,0.50)', bar: '#9BA3AF', shadow: '0 0 12px rgba(155,163,175,0.22)'
        },
        // Platinum II — luminous platinum
        {
            key: 'Platinum-II', tier: 'Platinum', level: 2, min: 3000, max: 3499, next: 'Platinum-III', nextPts: 3500,
            emoji: '💎', roman: 'II',
            color: '#CBD5E1', glow: 'rgba(203,213,225,0.35)',
            gradient: 'linear-gradient(135deg, rgba(203,213,225,0.20) 0%, rgba(203,213,225,0.08) 100%)',
            border: 'rgba(203,213,225,0.65)', bar: '#CBD5E1', shadow: '0 0 18px rgba(203,213,225,0.35)'
        },
        // Platinum III — brilliant platinum shimmer
        {
            key: 'Platinum-III', tier: 'Platinum', level: 3, min: 3500, max: Infinity, next: null, nextPts: null,
            emoji: '💎', roman: 'III',
            color: '#E8EDF5', glow: 'rgba(232,237,245,0.55)',
            gradient: 'linear-gradient(135deg, rgba(232,237,245,0.28) 0%, rgba(180,190,230,0.12) 100%)',
            border: 'rgba(232,237,245,0.80)', bar: '#E8EDF5', shadow: '0 0 28px rgba(232,237,245,0.55)'
        },
    ];

    const getCurrentLevel = (pts) => tierLevels.find(t => pts >= t.min && pts <= t.max) || tierLevels[0];
    const tier = getCurrentLevel(LIVE_POINTS);

    // Within-level progress (for the sub-level bar)
    const levelProgress = tier.nextPts
        ? Math.min(((LIVE_POINTS - tier.min) / (tier.nextPts - tier.min)) * 100, 100)
        : 100;

    // Overall tier-family progress (Bronze → Silver → Gold → Platinum)
    const tierFamilyMax = { Bronze: 500, Silver: 1000, Gold: 2500, Platinum: 3500 };
    const tierFamilyMin = { Bronze: 0, Silver: 500, Gold: 1000, Platinum: 2500 };
    const familyProgress = tier.tier === 'Platinum' && !tier.nextPts
        ? 100
        : Math.min(((LIVE_POINTS - tierFamilyMin[tier.tier]) / (tierFamilyMax[tier.tier] - tierFamilyMin[tier.tier])) * 100, 100);

    // Dot state for 3 level dots
    const levelDots = [1, 2, 3].map(l => l <= tier.level);


    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>{t.welcome}, {user.name}!</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.shopName || 'Shop'} · LocalSaathi</p>

                </div>
                <Link to="/profile" className="btn btn-outline btn-sm">{t.profile}</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card anim-slide-up stagger-1" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={32} color="var(--primary-color)" />
                    <div>
                        <h3>{materialRequests.length}</h3>
                        <small>{t.newLeads}</small>
                    </div>
                </div>
                <div className="card anim-slide-up stagger-2" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <TrendingUp size={32} color="var(--secondary-color)" />
                    <div>
                        <h3>{myQuotations.length}</h3>
                        <small>Quotations Sent</small>
                    </div>
                </div>
                <div className="card anim-slide-up stagger-3" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <CheckCircle size={32} color="var(--success-color)" />
                    <div>
                        <h3>{myOrders.length}</h3>
                        <small>{t.activeOrders}</small>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>

                {/* Leads List */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>New Material Requests</h3>
                    <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', flex: 1, outline: 'none', color: 'var(--text-primary)' }}
                        />
                    </div>
                    {materialRequests.length === 0 ? (
                        <div className="card">No new requests in your category.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {materialRequests.slice(0, 5).map((req, idx) => (
                                <div key={req.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.1 + idx * 0.07}s both` }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h4 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1rem' }}>{req.category}</h4>
                                            <span className="badge badge-open" style={{ fontSize: '0.7rem' }}>Open</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0', fontSize: '0.9rem' }}>{req.requirements.substring(0, 50)}...</p>
                                        <small>Qty: {req.quantity}</small>
                                    </div>
                                    <Link to={`/lead/${req.id}`} className="btn btn-primary btn-sm">Quote</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Orders */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>{t.activeOrders}</h3>
                    {myOrders.length === 0 ? (
                        <div className="card">{t.noactive}</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {myOrders.map(order => {
                                const req = requests.find(r => r.id === order.requestId);
                                return (
                                    <div key={order.id} className="card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong>Order #{order.id.slice(-4)}</strong>
                                            <span className={`badge badge-${order.status === 'completed' ? 'completed' : 'success'}`}>
                                                {order.status === 'completed' ? 'Completed' : 'Accepted'}
                                            </span>
                                        </div>
                                        {req && <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'capitalize' }}>{req.category}</div>}
                                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{order.totalAmount || order.amount}</span></div>

                                        {order.items && order.items.length > 0 && (
                                            <div style={{ fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '4px' }}>
                                                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Items:</strong>
                                                <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                                                    {order.items.map((item, i) => (
                                                        <li key={i}>{item.qty}x {item.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {order.status === 'accepted' ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
                                                onClick={() => {
                                                    completeOrder(order.id);
                                                    alert('Order marked as completed!');
                                                }}
                                            >
                                                <CheckCircle size={16} /> Complete Order
                                            </button>
                                        ) : (
                                            <div style={{ color: 'var(--success-color)', fontWeight: 600, textAlign: 'center', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--surface-color)', borderRadius: '4px' }}>
                                                🎉 Order Completed
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Rewards & Analytics */}
            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Performance & Rewards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="card" style={{
                        background: tier.gradient,
                        border: `1.5px solid ${tier.border}`,
                        boxShadow: tier.shadow,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* ── Top row: badge + level dots ── */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            {/* Badge pill */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.22rem 0.7rem',
                                borderRadius: '999px',
                                background: `${tier.color}20`,
                                border: `1px solid ${tier.border}`,
                            }}>
                                <span style={{ fontSize: '0.95rem' }}>{tier.emoji}</span>
                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: tier.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {tier.tier}&nbsp;<span style={{ fontWeight: 900 }}>{tier.roman}</span>
                                </span>
                            </div>
                            {/* Level dots */}
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                {levelDots.map((filled, i) => (
                                    <div key={i} style={{
                                        width: filled ? '10px' : '8px',
                                        height: filled ? '10px' : '8px',
                                        borderRadius: '50%',
                                        background: filled ? tier.color : 'rgba(255,255,255,0.10)',
                                        border: `1.5px solid ${filled ? tier.color : 'rgba(255,255,255,0.20)'}`,
                                        boxShadow: filled ? `0 0 6px ${tier.glow}` : 'none',
                                        transition: 'all 0.3s ease',
                                    }} />
                                ))}
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                            Earn 2% reward points on every order
                        </p>

                        {/* ── Points value ── */}
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: tier.color, margin: '0.6rem 0 0.2rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                            {LIVE_POINTS.toLocaleString()}
                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.3rem' }}>pts</span>
                        </div>

                        {/* ── Within-level progress bar ── */}
                        <div style={{ marginTop: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level progress</small>
                                <small style={{ color: tier.color, fontSize: '0.7rem', fontWeight: 600 }}>{Math.round(levelProgress)}%</small>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${levelProgress}%`, background: tier.bar, borderRadius: '99px', transition: 'width 0.6s ease', boxShadow: `0 0 6px ${tier.glow}` }} />
                            </div>
                        </div>



                        {/* ── Next step label ── */}
                        <div style={{ marginTop: '0.75rem' }}>
                            {tier.nextPts ? (
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.73rem' }}>
                                    {(tier.nextPts - LIVE_POINTS).toLocaleString()} pts to&nbsp;
                                    <strong style={{ color: tier.color }}>{tier.next?.replace('-', ' ')}</strong>
                                </small>
                            ) : (
                                <small style={{ color: tier.color, fontWeight: 700, fontSize: '0.78rem' }}>🏆 Maximum tier achieved!</small>
                            )}
                        </div>
                    </div>
                    <div className="card">
                        <h3>Customer Ratings</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                                {getShopkeeperRating(user.id) > 0 ? getShopkeeperRating(user.id).toFixed(1) : '—'}
                            </span>
                            <span>/ 5.0</span>
                        </div>
                        {(() => {
                            const ratingCount = quotations.filter(q => q.shopkeeperId === user.id && q.feedback).length;
                            return (
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {ratingCount === 0
                                        ? 'No ratings yet — complete orders to get rated!'
                                        : `Based on ${ratingCount} review${ratingCount === 1 ? '' : 's'}`}
                                </p>
                            );
                        })()}
                    </div>
                    <div className="card">
                        <h3>Monthly Revenue</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>₹45,200</div>
                        <p style={{ color: 'var(--success-color)' }}>+12% from last month</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopkeeperDashboard;
