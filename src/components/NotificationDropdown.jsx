import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Check } from 'lucide-react';

const NotificationDropdown = ({ onClose }) => {
    const { notifications, markNotificationRead } = useData();

    // Sort by date desc
    const sortedNotifs = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedNotifs.length === 0) {
        return (
            <div style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', width: '300px', maxHeight: '400px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000 }}>
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Notifications</div>
            {sortedNotifs.map(notif => (
                <div key={notif.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: notif.read ? 'transparent' : 'rgba(var(--primary-rgb), 0.05)' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{notif.message}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ color: 'var(--text-secondary)' }}>{new Date(notif.date).toLocaleTimeString()}</small>
                        {!notif.read && (
                            <button onClick={() => markNotificationRead(notif.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }} title="Mark as read">
                                <Check size={14} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationDropdown;
