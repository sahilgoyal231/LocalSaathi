import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ShopkeeperDashboard from './ShopkeeperDashboard';
import ServicemanDashboard from './ServicemanDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

    switch (user.role) {
        case 'customer':
            return <CustomerDashboard />;
        case 'shopkeeper':
            return <ShopkeeperDashboard />;
        case 'serviceman':
            return <ServicemanDashboard />;
        default:
            return <div className="container" style={{ padding: '2rem' }}>Unknown Role</div>;
    }
};

export default Dashboard;
