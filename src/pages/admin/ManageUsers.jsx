import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.token]);

    const handleVerify = async (id) => {
        if (window.confirm('Are you sure you want to verify this user?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/admin/verify/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.map((u) => (u._id === id ? { ...u, isVerified: true } : u)));
                } else {
                    throw new Error('Failed to verify user');
                }
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/admin/user/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.filter((u) => u._id !== id));
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Role</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Joined</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        u.role === 'serviceman' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {u.role === 'serviceman' && (
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {u.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {u.role === 'serviceman' && !u.isVerified && (
                                        <button
                                            onClick={() => handleVerify(u._id)}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
