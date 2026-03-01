import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Phone, Briefcase, DollarSign, Clock, LayoutGrid, ShieldCheck, Star } from 'lucide-react';
import { serviceThemes } from '../utils/serviceThemes';
import { translations } from '../utils/translations';

const ServicemanProfile = () => {
    const { user, updateProfile } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user.name || '',
        contact: user.contact || '',
        address: user.address || '',
        skills: user.skills || '',
        experience: user.experience || '',
        rates: user.rates || '',
        serviceArea: user.serviceArea || '5km',
        availability: user.availability || 'Weekdays 9-6'
    });

    const theme = useMemo(() => {
        return serviceThemes[formData.skills] || serviceThemes['default'];
    }, [formData.skills]);

    const ThemeIcon = theme.icon;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updates = { ...formData };

        // If the skills category changed, invalidate verification
        if (formData.skills !== user.skills) {
            updates.skillVerified = false;
        }

        updateProfile(updates);

        if (formData.skills !== user.skills) {
            navigate('/skill-quiz');
        } else {
            navigate('/dashboard');
        }
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
                background: `linear-gradient(160deg, rgba(9,9,11,0.82) 0%, rgba(9,9,11,0.70) 50%, ${theme.accent} 100%)`,
                backdropFilter: 'blur(1px)',
                borderBottom: `3px solid ${theme.primary}`,
                zIndex: 0,
            }} />

            {/* ── Body (positioned above the overlay) ────────── */}
            <div style={{
                position: 'relative', zIndex: 1,
                maxWidth: '880px',
                margin: '0 auto',
                padding: '2rem 1rem 3rem',
                animation: 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                {/* ── Page header row ──────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                            width: '52px', height: '52px', borderRadius: '13px',
                            background: theme.buttonGradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 0 0 3px rgba(0,0,0,0.35), 0 0 18px ${theme.accent}`,
                        }}>
                            <ThemeIcon size={24} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                                {formData.name || t.profile}
                            </h1>
                            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: theme.secondary, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                                {formData.skills ? formData.skills.replace(/([A-Z])/g, ' $1').trim() : t.selectSkill}
                            </p>
                        </div>
                    </div>

                    {user.skillVerified ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'rgba(16,185,129,0.18)',
                            backdropFilter: 'blur(10px)',
                            color: '#34D399',
                            padding: '0.45rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid rgba(52,211,153,0.30)',
                            fontSize: '0.8rem', fontWeight: 600,
                        }}>
                            <ShieldCheck size={14} /> {t.verifiedExpert}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/skill-quiz')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.65rem 1.5rem',
                                background: theme.buttonGradient,
                                color: '#fff', border: 'none',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                fontSize: '1rem', fontWeight: 600,
                                boxShadow: `0 4px 15px ${theme.accent}`,
                            }}
                        >
                            <ShieldCheck size={16} /> {t.verifySkills}
                        </button>
                    )}
                </div>

                {/* ── Form Card (glassmorphism on top of the full-bg) ── */}
                <div className="card" style={{
                    borderTop: `3px solid ${theme.primary}`,
                    background: 'rgba(17,24,39,0.90)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid ${theme.border}`,
                    borderTopWidth: '3px',
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>

                            {/* Left — Basic Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <h3 style={{
                                    fontSize: '0.75rem', fontWeight: 600,
                                    color: theme.primary,
                                    textTransform: 'uppercase', letterSpacing: '0.09em',
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    borderBottom: `1px solid ${theme.border}`,
                                    paddingBottom: '0.65rem', margin: 0
                                }}>
                                    <LayoutGrid size={13} /> {t.basicDetails}
                                </h3>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.fullName}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={t.fullName}
                                        style={{ '--input-focus': theme.primary }}
                                        onFocus={e => e.target.style.borderColor = theme.primary}
                                        onBlur={e => e.target.style.borderColor = ''}
                                    />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.contactNumber}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.primary, pointerEvents: 'none' }} />
                                        <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 98765..."
                                            style={{ paddingLeft: '2.5rem' }}
                                            onFocus={e => e.target.style.borderColor = theme.primary}
                                            onBlur={e => e.target.style.borderColor = ''}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.skillsCategory}</label>
                                    <select name="skills" value={formData.skills} onChange={handleChange}
                                        style={{ borderColor: theme.border }}
                                        onFocus={e => e.target.style.borderColor = theme.primary}
                                        onBlur={e => e.target.style.borderColor = theme.border}
                                    >
                                        <option value="">{t.selectSkill}</option>
                                        {Object.keys(serviceThemes)
                                            .filter(k => !['default', 'Shopkeeper', 'Customer'].includes(k))
                                            .map(service => (
                                                <option key={service} value={service}>{service.replace(/([A-Z])/g, ' $1').trim()}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.yearsExperience}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Briefcase size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.primary, pointerEvents: 'none' }} />
                                        <input type="number" min="0" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5"
                                            style={{ paddingLeft: '2.5rem' }}
                                            onFocus={e => e.target.style.borderColor = theme.primary}
                                            onBlur={e => e.target.style.borderColor = ''}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right — Service Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <h3 style={{
                                    fontSize: '0.75rem', fontWeight: 600,
                                    color: theme.primary,
                                    textTransform: 'uppercase', letterSpacing: '0.09em',
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    borderBottom: `1px solid ${theme.border}`,
                                    paddingBottom: '0.65rem', margin: 0
                                }}>
                                    <MapPin size={13} /> {t.serviceInfo}
                                </h3>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.baseLocation}</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3"
                                        placeholder={t.baseLocation} style={{ resize: 'none' }}
                                        onFocus={e => e.target.style.borderColor = theme.primary}
                                        onBlur={e => e.target.style.borderColor = ''}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label>{t.ratePerVisit}</label>
                                        <div style={{ position: 'relative' }}>
                                            <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.primary, pointerEvents: 'none' }} />
                                            <input type="text" name="rates" value={formData.rates} onChange={handleChange} placeholder="e.g. 500"
                                                style={{ paddingLeft: '2.4rem' }}
                                                onFocus={e => e.target.style.borderColor = theme.primary}
                                                onBlur={e => e.target.style.borderColor = ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label>{t.serviceRadius}</label>
                                        <select name="serviceArea" value={formData.serviceArea} onChange={handleChange}
                                            onFocus={e => e.target.style.borderColor = theme.primary}
                                            onBlur={e => e.target.style.borderColor = ''}
                                        >
                                            <option value="2km">2 km</option>
                                            <option value="5km">5 km</option>
                                            <option value="10km">10 km</option>
                                            <option value="City-wide">City-wide</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label>{t.availability}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Clock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.primary, pointerEvents: 'none' }} />
                                        <input type="text" name="availability" value={formData.availability} onChange={handleChange}
                                            placeholder="e.g. Mon–Sat, 9AM–7PM" style={{ paddingLeft: '2.5rem' }}
                                            onFocus={e => e.target.style.borderColor = theme.primary}
                                            onBlur={e => e.target.style.borderColor = ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save button — category-colored */}
                        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-full"
                                style={{
                                    background: theme.buttonGradient,
                                    border: 'none', color: '#fff',
                                    padding: '0.85rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: `0 4px 20px ${theme.accent}`,
                                }}
                            >
                                <Save size={18} /> {t.saveChanges}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Stats Row ──────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                    {[
                        { icon: <Star size={16} color={theme.primary} />, label: t.rating, value: `${user.rating || '4.8'} / 5.0` },
                        { icon: <Briefcase size={16} color={theme.primary} />, label: t.experience, value: `${formData.experience || '—'} yrs` },
                        { icon: <MapPin size={16} color={theme.primary} />, label: t.serviceRadius, value: formData.serviceArea || '5km' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1.1rem',
                            borderLeft: `3px solid ${theme.primary}`,
                            background: 'rgba(17,24,39,0.90)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: `1px solid ${theme.border}`,
                            borderLeftWidth: '3px',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicemanProfile;
