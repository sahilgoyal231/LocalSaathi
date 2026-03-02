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
            if (!user.skillVerified) {
                return <Navigate to="/skill-quiz" replace />;
            }
            return <ServicemanDashboard />;
        default:
            return <div className="container" style={{ padding: '2rem' }}>Unknown Role</div>;
    }
};

export default Dashboard;
