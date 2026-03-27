import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Wrench, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, servicemen: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user.token]);

    if (loading) return (
        <div className="container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading stats...
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error-color)' }}>
            Error: {error}
        </div>
    );

    return (
        <div style={{ background: 'var(--background-color)', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
                padding: '2.5rem 0', marginBottom: '2rem'
            }}>
                <div className="container">
                    <h1 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 700 }}>Admin Dashboard</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>Platform overview & management</p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <Link to="users" className="card card-hoverable anim-slide-up stagger-1" style={{
                        textDecoration: 'none', padding: '1.5rem',
                        borderTop: '4px solid var(--primary-color)', borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '14px',
                            background: 'var(--primary-light)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                        }}>
                            <Users size={24} color="var(--primary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Total Users</h2>
                        <p style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.users}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Click to manage users →</p>
                    </Link>

                    <div className="card anim-slide-up stagger-2" style={{
                        padding: '1.5rem',
                        borderTop: '4px solid var(--success-color)', borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '14px',
                            background: 'var(--success-muted)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                        }}>
                            <Wrench size={24} color="var(--success-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Servicemen</h2>
                        <p style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--success-color)' }}>{stats.servicemen}</p>
                    </div>

                    <div className="card anim-slide-up stagger-3" style={{
                        padding: '1.5rem',
                        borderTop: '4px solid var(--secondary-color)', borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '14px',
                            background: 'var(--warning-muted)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                        }}>
                            <BarChart3 size={24} color="var(--secondary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Analytics</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
