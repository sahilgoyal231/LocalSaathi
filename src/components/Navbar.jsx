import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Menu, X, LogOut, User, Globe, Bell, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { languages, translations } from '../utils/translations';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, changeLanguage, notifications } = useData();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const unreadCount = notifications.filter(n => !n.read && (n.userId === user?.id || !n.userId)).length;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const t = translations[language];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a
                    href="#"
                    className="navbar-logo"
                    onClick={(e) => { e.preventDefault(); navigate(0); }}
                >
                    <img src={logoImg} alt="LocalSaathi" className="navbar-logo-img" />
                    LocalSaathi
                </a>

                <div className="navbar-menu-icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>

                <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <li>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Globe size={18} />
                            <div id="google_translate_element"></div>
                        </div>
                    </li>
                    {user && (
                        <li style={{ position: 'relative' }}>
                            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
                                )}
                            </button>
                            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                        </li>
                    )}
                    {!user ? (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="navbar-btn navbar-btn--login"
                                    title={t.login}
                                >
                                    <LogIn size={16} />
                                    <span>{t.login}</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="navbar-btn navbar-btn--register"
                                    title={t.register}
                                >
                                    <UserPlus size={16} />
                                    <span>{t.register}</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/profile" className="navbar-profile-btn" title="View Profile">
                                    <span className="navbar-avatar">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="navbar-profile-info">
                                        <span className="navbar-profile-name">{user.name}</span>
                                        <span className="navbar-profile-role">{user.role}</span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="navbar-logout-btn"
                                    title={t.logout}
                                >
                                    <LogOut size={17} />
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav >
    );
};

export default Navbar;
