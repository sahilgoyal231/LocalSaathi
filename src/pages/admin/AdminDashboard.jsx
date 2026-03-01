import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

    if (loading) return <div className="p-8 text-center">Loading stats...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="users" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                    <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                    <p className="text-4xl text-blue-600 font-bold">{stats.users}</p>
                    <p className="text-sm text-gray-500 mt-2">Click to manage users</p>
                </Link>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-2">Servicemen</h2>
                    <p className="text-4xl text-green-600 font-bold">{stats.servicemen}</p>
                </div>
                {/* Add more stats cards as needed */}
            </div>
        </div>
    );
};

export default AdminDashboard;
