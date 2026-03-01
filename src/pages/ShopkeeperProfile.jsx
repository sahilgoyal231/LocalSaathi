import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Store } from 'lucide-react';
import { serviceThemes } from '../utils/serviceThemes';

const ShopkeeperProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const theme = serviceThemes['Shopkeeper'];
    const ThemeIcon = theme.icon;

    const [formData, setFormData] = useState({
        shopName: user.shopName || '',
        gst: user.gst || '',
        address: user.address || '',
        contact: user.contact || '',
        businessHours: user.businessHours || '09:00 - 20:00',
        usps: user.usps || '',
        deliveryOptions: user.deliveryOptions || 'Pickup Only',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        navigate('/dashboard');
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
            {/* Full-page dark + indigo-tinted overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(160deg, rgba(9,9,11,0.82) 0%, rgba(9,9,11,0.70) 50%, ${theme.accent} 100%)`,
                zIndex: 0,
            }} />

            {/* ── Body ─────────────────────────────────────────── */}
            <div style={{
                position: 'relative', zIndex: 1,
                maxWidth: '780px',
                margin: '0 auto',
                padding: '2rem 1rem 3rem',
                animation: 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                {/* Page header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 0.9rem',
                            background: 'rgba(0,0,0,0.50)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            fontSize: '0.8rem', fontWeight: 500,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.70)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.50)'}
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '13px',
                        background: theme.buttonGradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 0 3px rgba(0,0,0,0.35), 0 0 16px ${theme.accent}`,
                    }}>
                        <ThemeIcon size={22} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                            Shop Profile
                        </h1>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: theme.secondary, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            Update your shop details and business information
                        </p>
                    </div>
                </div>
                <div className="card" style={{
                    borderTop: `3px solid ${theme.primary}`,
                    background: 'rgba(17,24,39,0.82)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid ${theme.border}`,
                    borderTopWidth: '3px',
                }}>
                    <h2 style={{ marginBottom: '1.5rem', color: theme.primary, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Store size={16} /> Edit Shop Profile
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Shop Name</label>
                                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required
                                    onFocus={e => e.target.style.borderColor = theme.primary}
                                    onBlur={e => e.target.style.borderColor = ''}
                                />
                            </div>
                            <div className="form-group">
                                <label>GST Number</label>
                                <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST123..."
                                    onFocus={e => e.target.style.borderColor = theme.primary}
                                    onBlur={e => e.target.style.borderColor = ''}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 98765..."
                                    onFocus={e => e.target.style.borderColor = theme.primary}
                                    onBlur={e => e.target.style.borderColor = ''}
                                />
                            </div>
                            <div className="form-group">
                                <label>Business Hours</label>
                                <input type="text" name="businessHours" value={formData.businessHours} onChange={handleChange} placeholder="e.g. 9 AM - 9 PM"
                                    onFocus={e => e.target.style.borderColor = theme.primary}
                                    onBlur={e => e.target.style.borderColor = ''}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Full shop address..."
                                style={{ resize: 'none' }}
                                onFocus={e => e.target.style.borderColor = theme.primary}
                                onBlur={e => e.target.style.borderColor = ''}
                            />
                        </div>

                        <div className="form-group">
                            <label>Unique Selling Points (USPs)</label>
                            <textarea
                                name="usps"
                                value={formData.usps}
                                onChange={handleChange}
                                rows="2"
                                placeholder="e.g. Authorized Dealer for Asian Paints, 10% discount on bulk orders..."
                                style={{ resize: 'none', borderColor: theme.border }}
                                onFocus={e => e.target.style.borderColor = theme.primary}
                                onBlur={e => e.target.style.borderColor = theme.border}
                            />
                            <small style={{ color: 'var(--text-muted)' }}>Highlight what makes your shop special.</small>
                        </div>

                        <div className="form-group">
                            <label>Delivery Options</label>
                            <select name="deliveryOptions" value={formData.deliveryOptions} onChange={handleChange}
                                onFocus={e => e.target.style.borderColor = theme.primary}
                                onBlur={e => e.target.style.borderColor = ''}
                            >
                                <option value="Pickup Only">Pickup Only</option>
                                <option value="Delivery Available (Charges Apply)">Delivery Available (Charges Apply)</option>
                                <option value="Free Delivery">Free Delivery within 5km</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-full"
                            style={{
                                marginTop: '0.5rem',
                                background: theme.buttonGradient,
                                border: 'none', color: '#fff',
                                padding: '0.85rem', fontSize: '1rem', fontWeight: 600,
                                boxShadow: `0 4px 20px ${theme.accent}`,
                            }}
                        >
                            <Save size={18} /> Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopkeeperProfile;
