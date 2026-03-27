import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import '../styles/Auth.css';

const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let timeout;
        let isDeleting = false;
        let i = 0;

        const animate = () => {
            if (!isDeleting) {
                setDisplayedText(text.slice(0, i));

                if (i < text.length) {
                    i++;
                    // Natural typing speed
                    const delay = Math.random() * 40 + 70;
                    timeout = setTimeout(animate, delay);
                } else {
                    // Reached the end, pause for a small interval
                    isDeleting = true;
                    timeout = setTimeout(animate, 3000);
                }
            } else {
                setDisplayedText(text.slice(0, i));

                if (i > 0) {
                    i--;
                    // Faster backspace speed
                    const delay = Math.random() * 20 + 30;
                    timeout = setTimeout(animate, delay);
                } else {
                    // Reached the beginning, pause before restarting
                    isDeleting = false;
                    timeout = setTimeout(animate, 800);
                }
            }
        };

        timeout = setTimeout(animate, 500);

        return () => clearTimeout(timeout);
    }, [text]);

    return (
        <h2 style={{
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            whiteSpace: 'nowrap',
            height: '2.5rem',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1.5rem 0'
        }}>
            <style>
                {`
                    @keyframes smoothBlink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.2; }
                    }
                `}
            </style>
            {displayedText}
            <span
                className="typewriter-cursor"
                style={{
                    display: 'inline-block',
                    width: '1px',
                    height: '1.2em',
                    backgroundColor: 'currentColor',
                    marginLeft: '4px',
                    animation: 'smoothBlink 1.5s ease-in-out infinite'
                }}
            />
        </h2>
    );
};

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, demoLogin } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(identifier, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    const handleDemoLogin = (role) => {
        demoLogin(role, `${role}@example.com`, `${role.charAt(0).toUpperCase() + role.slice(1)} Demo`);
        navigate('/dashboard');
    };

    return (
        <div className="auth-split-layout">
            <div className="auth-form-side">
                <div className="auth-container">
                    <div className="auth-card card">
                        <div className="auth-brand">
                            <img src={logoImg} alt="LocalSaathi" className="auth-logo" />
                            <span className="auth-brand-name">LocalSaathi</span>
                        </div>
                        <TypewriterText text="Welcome to Your only Saathi!" />
                        <p className="auth-subtitle">{t?.loginSubtitle || "Login to access your LocalSaathi dashboard"}</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label>{t?.emailOrMobile || "Email or Mobile Number"}</label>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={t?.enterEmailOrMobile || "Enter email or mobile"}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{t?.password || "Password"}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t?.enterPassword || "Enter your password"}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-full">{t?.login || "Login"}</button>
                        </form>

                        <div className="auth-divider">
                            <span>{t?.orDemo || "OR DEMO AS"}</span>
                        </div>

                        <div className="demo-actions">
                            <button onClick={() => handleDemoLogin('customer')} className="btn btn-outline btn-sm">{t?.customer || "Customer"}</button>
                            <button onClick={() => handleDemoLogin('shopkeeper')} className="btn btn-outline btn-sm">{t?.shopkeeper || "Shopkeeper"}</button>
                            <button onClick={() => handleDemoLogin('serviceman')} className="btn btn-outline btn-sm">{t?.serviceman || "Serviceman"}</button>
                        </div>

                        <p className="auth-footer">
                            {t?.dontHaveAccount || "Don't have an account?"} <Link to="/register">{t?.register || "Register"}</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="auth-hero-side">
                <div style={{
                    position: 'relative', zIndex: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem',
                    maxWidth: '440px', textAlign: 'center'
                }}>
                    {/* Headline */}
                    <div>
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800,
                            color: '#1E1B4B', letterSpacing: '-0.03em',
                            lineHeight: 1.2, marginBottom: '0.75rem'
                        }}>
                            Your Trusted Partner for Home Services
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#4338CA', lineHeight: 1.6, fontWeight: 500 }}>
                            Book verified professionals, get material quotes, and manage everything from one platform.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center'
                    }}>
                        {[
                            { num: '10K+', label: 'Services' },
                            { num: '5K+', label: 'Users' },
                            { num: '50+', label: 'Cities' }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                flex: 1, background: '#FFFFFF',
                                borderRadius: '14px', padding: '1.25rem 0.75rem',
                                boxShadow: '0 2px 12px rgba(79,70,229,0.08)',
                                border: '1px solid rgba(99,102,241,0.12)'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5' }}>{stat.num}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '1rem',
                        textAlign: 'left', width: '100%'
                    }}>
                        {[
                            { icon: '🛡️', title: 'Verified Professionals', desc: 'Background-checked & skill-tested pros' },
                            { icon: '💰', title: 'Best Price Guarantee', desc: 'Transparent pricing, no hidden charges' },
                            { icon: '⚡', title: 'Quick Response', desc: 'Get quotes within minutes, not days' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                background: 'rgba(255,255,255,0.7)', borderRadius: '12px',
                                padding: '0.85rem 1rem',
                                border: '1px solid rgba(99,102,241,0.08)'
                            }}>
                                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E1B4B' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 500 }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div style={{
                        background: '#FFFFFF', borderRadius: '14px',
                        padding: '1.25rem', width: '100%',
                        boxShadow: '0 2px 10px rgba(79,70,229,0.06)',
                        border: '1px solid rgba(99,102,241,0.1)',
                        textAlign: 'left'
                    }}>
                        <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
                            "LocalSaathi saved us hours of work finding reliable contractors. Highly recommended!"
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '0.75rem', fontWeight: 700
                            }}>R</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1E1B4B' }}>Rajesh K.</div>
                                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Homeowner, Hyderabad</div>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: '0.85rem', letterSpacing: '2px' }}>★★★★★</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
