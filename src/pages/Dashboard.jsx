import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ShopkeeperDashboard from './ShopkeeperDashboard';
import ServicemanDashboard from './ServicemanDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

    switch (user.role) {
        case 'customer':
            return <CustomerDashboard />;
        case 'shopkeeper':
            return <ShopkeeperDashboard />;
        case 'serviceman':
            // Check both React state AND localStorage to handle the race condition
            // where setUser() hasn't flushed yet but localStorage was already updated
            let isVerified = user.skillVerified;
            if (!isVerified) {
                try {
                    const stored = JSON.parse(localStorage.getItem('user') || '{}');
                    isVerified = stored.skillVerified;
                } catch (e) { /* ignore */ }
            }
            if (!isVerified) {
                return <Navigate to="/skill-quiz" replace />;
            }
            return <ServicemanDashboard />;
        default:
            return <div className="container" style={{ padding: '2rem' }}>Unknown Role</div>;
    }
};

export default Dashboard;
