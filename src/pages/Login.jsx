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
                {/* Dynamically sizing collage background image */}
            </div>
        </div>
    );
};

export default Login;
