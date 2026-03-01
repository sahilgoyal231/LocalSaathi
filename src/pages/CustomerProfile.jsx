import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { serviceThemes } from '../utils/serviceThemes';

const CustomerProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    // Initialize form with existing user data or defaults
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '', // Read-only usually
        contact: user.contact || '',
        address: user.address || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        navigate('/dashboard');
    };

    const theme = serviceThemes['Customer'];

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 1rem',
            backgroundImage: `url(${theme.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(9, 9, 11, 0.70)',
                zIndex: 0
            }} />
            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', width: '100%', position: 'relative', zIndex: 1 }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        marginBottom: '1.5rem',
                        padding: '0.5rem',
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s ease',
                    }}
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="card" style={{ background: 'var(--surface-color)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Edit Profile</h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" value={formData.email} disabled style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 98765..." />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Full address for deliveries..." />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                            <Save size={18} /> Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
