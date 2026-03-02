import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestMaterial from './pages/RequestMaterial';
import BookService from './pages/BookService';
import LeadDetails from './pages/LeadDetails';
import RequestDetails from './pages/RequestDetails';
import FeedbackPage from './pages/FeedbackPage';
import ShopkeeperProfile from './pages/ShopkeeperProfile';
import SkillQuiz from './pages/SkillQuiz';
import ServicemanProfile from './pages/ServicemanProfile';
import JobDetails from './pages/JobDetails';
import CustomerProfile from './pages/CustomerProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminRoute from './components/AdminRoute';
import LoadingPage from './components/LoadingPage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const ProfileRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'shopkeeper') return <ShopkeeperProfile />;
  if (user.role === 'serviceman') return <ServicemanProfile />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return <CustomerProfile />;
};

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // 1) Set a minimum display time for the professional animation (e.g., 3.5s)
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 3500));

    // 2) Create a promise that resolves when DOM is fully loaded
    const domLoadPromise = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    });

    // Wait for BOTH the minimum animation time AND the DOM to be fully ready
    Promise.all([minDelayPromise, domLoadPromise]).then(() => {
      setIsAppLoading(false);
    });
  }, []);

  if (isAppLoading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <PageTransition><Dashboard /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/request-material"
                  element={
                    <PrivateRoute>
                      <PageTransition><RequestMaterial /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/book-service"
                  element={
                    <PrivateRoute>
                      <PageTransition><BookService /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/lead/:id"
                  element={
                    <PrivateRoute>
                      <PageTransition><LeadDetails /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/request/:id"
                  element={
                    <PrivateRoute>
                      <PageTransition><RequestDetails /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/feedback/:id"
                  element={
                    <PrivateRoute>
                      <PageTransition><FeedbackPage /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <PageTransition><ProfileRedirect /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/skill-quiz"
                  element={
                    <PrivateRoute>
                      <PageTransition><SkillQuiz /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/job/:id"
                  element={
                    <PrivateRoute>
                      <PageTransition><JobDetails /></PageTransition>
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
                  <Route path="users" element={<PageTransition><ManageUsers /></PageTransition>} />
                </Route>
              </Routes>
            </div>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

