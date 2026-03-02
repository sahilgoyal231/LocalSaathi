import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { serviceThemes } from '../utils/serviceThemes';
import logoImg from '../assets/logo.png';
import '../styles/Auth.css';


const Register = () => {
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        identifier: '',
        password: '',
        role: 'customer',
        // Role specific fields
        shopName: '',
        gst: '',
        skills: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectSkill = (category) => setFormData({ ...formData, skills: category });
    const services = Object.keys(serviceThemes).filter(k => !['default', 'Shopkeeper', 'Customer'].includes(k));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.identifier || !formData.password) {
            setError('Please fill in all required fields.');
            return;
        }

        const res = await register(formData);
        if (res.success) {
            if (formData.role === 'serviceman') {
                navigate('/skill-quiz');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(res.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <div className="auth-brand">
                    <img src={logoImg} alt="LocalSaathi" className="auth-logo" />
                    <span className="auth-brand-name">LocalSaathi</span>
                </div>
                <h2>{t?.createAccount || "Create Account"}</h2>
                <p className="auth-subtitle">{t?.joinToday || "Join LocalSaathi today"}</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>{t?.iAm || "I am a..."}</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="customer">{t?.customer || "Customer"} (Buying)</option>
                            <option value="shopkeeper">{t?.shopkeeper || "Shopkeeper"} (Selling)</option>
                            <option value="serviceman">{t?.serviceman || "Serviceman"} (Working)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t?.fullName || "Full Name"}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t?.yourName || "Your Name"}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t?.emailOrMobile || "Email or Mobile Number"}</label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder={t?.enterEmailOrMobile || "email@example.com or 9876543210"}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t?.password || "Password"}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t?.createPassword || "Create a password"}
                            required
                        />
                    </div>

                    {/* Role Specific Fields */}
                    {formData.role === 'shopkeeper' && (
                        <>
                            <div className="form-group">
                                <label>{t?.shopName || "Shop Name"}</label>
                                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="My Shop" required />
                            </div>
                            <div className="form-group">
                                <label>{t?.gst || "GST Number"}</label>
                                <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST123..." />
                            </div>
                        </>
                    )}

                    {formData.role === 'serviceman' && (
                        <div className="form-group">
                            <label>{t?.primarySkill || "Primary Skill"}</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                                {services.map(service => {
                                    const isSelected = formData.skills === service;
                                    const theme = serviceThemes[service];
                                    const ThemeIcon = theme.icon;

                                    return (
                                        <div
                                            key={service}
                                            onClick={() => selectSkill(service)}
                                            onMouseEnter={() => setHoveredSkill(service)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            style={{
                                                cursor: 'pointer',
                                                border: isSelected ? `2px solid var(--primary-color)` : '1px solid var(--border-color)',
                                                borderRadius: '0.75rem',
                                                overflow: 'hidden',
                                                transition: 'all 0.2s ease',
                                                boxShadow: isSelected ? `0 4px 12px var(--primary-color)40` : 'none',
                                                background: 'var(--surface-color)',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ height: '80px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                                <img
                                                    src={theme.image}
                                                    alt={service}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    backgroundColor: 'rgba(9, 9, 11, 0.7)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: hoveredSkill === service ? 1 : 0,
                                                    transition: 'opacity 0.2s ease',
                                                    pointerEvents: 'none'
                                                }}>
                                                    {ThemeIcon && <ThemeIcon size={20} color="#ffffff" />}
                                                </div>
                                            </div>
                                            <div style={{
                                                textAlign: 'center',
                                                background: isSelected ? 'var(--primary-color)' : 'var(--surface-color)',
                                                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                padding: '0.5rem',
                                                borderTop: isSelected ? `1px solid var(--primary-color)` : '1px solid var(--border-color)'
                                            }}>
                                                {service.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                            {
                                                isSelected && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        right: '4px',
                                                        background: 'var(--primary-color)',
                                                        color: '#ffffff',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                                    }}>✓</div>
                                                )
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-full">{t?.register || "Register"}</button>
                </form>

                <p className="auth-footer">
                    {t?.alreadyHaveAccount || "Already have an account?"} <Link to="/login">{t?.login || "Login"}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
