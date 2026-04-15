import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import AddCustomer from '../pages/AddCustomer';
import EditCustomer from '../pages/EditCustomer';
import TrialCustomers from '../pages/TrialCustomers';
import SubscriptionManagement from '../pages/SubscriptionManagement';
import Reports from '../pages/Reports';
import ActivityLogs from '../pages/ActivityLogs';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Notifications from '../pages/Notifications';
import NotFound from '../pages/NotFound';

const isAuth = () => localStorage.getItem('crm_auth') === 'true';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  isAuth() ? <>{children}</> : <Navigate to="/login" replace />;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><MainLayout /></Protected>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/add" element={<AddCustomer />} />
        <Route path="customers/edit/:id" element={<EditCustomer />} />
        <Route path="trial-customers" element={<TrialCustomers />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
