import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { translations } from '../utils/translations';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, demoLogin } = useAuth();
    const { language } = useData();
    const t = translations[language];
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
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
                        <h2>{t?.welcomeBack || "Welcome Back"}</h2>
                        <p className="auth-subtitle">{t?.loginSubtitle || "Login to access your LocalSaathi dashboard"}</p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label>{t?.emailAddr || "Email Address"}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t?.enterEmail || "Enter your email"}
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
