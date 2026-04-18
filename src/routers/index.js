import { Route, Routes } from 'react-router-dom';

// Guards
import PrivateRoute from '../components/guards/PrivateRoute';
import RoleGuard from '../components/guards/RoleGuard';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import ProfilePage from '../pages/auth/ProfilePage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ExpensePage from '../pages/expenses/ExpensePage';
import InventoryIndexPage from '../pages/inventory/InventoryIndex';
import InventoryPage from '../pages/inventory/InventoryPage';
import TransactionHistoryPage from '../pages/inventory/TransactionHistoryPage';
import ProductListPage from '../pages/products/ProductListPage';
import ReportPage from '../pages/reports/ReportPage';
import UserManagePage from '../pages/users/UserManagePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* App Routes (Private) */}
      <Route path="/" element={<PrivateRoute />}>

        {/* Route chung cho mọi người đã đăng nhập */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/inventory" element={<InventoryIndexPage />} />
        <Route path="/inventory/manage" element={<InventoryPage />} />
        <Route path="/inventory/history" element={<TransactionHistoryPage />} />

        {/* Admin + Manager Routes */}
        <Route path="/" element={
          <RoleGuard requireRoles={['admin', 'manager']}>
            <DashboardPage />
          </RoleGuard>
        } />

        <Route path="/expenses" element={
          <RoleGuard requireRoles={['admin', 'manager']}>
            <ExpensePage />
          </RoleGuard>
        } />

        <Route path="/users" element={
          <RoleGuard requireRoles={['admin', 'manager']}>
            <UserManagePage />
          </RoleGuard>
        } />

        <Route path="/reports" element={
          <RoleGuard requireRoles={['admin', 'manager']}>
            <ReportPage />
          </RoleGuard>
        } />

      </Route>

      <Route path="*" element={<div className="flex justify-center items-center h-screen bg-slate-900 text-white text-3xl font-bold">404 - Không tìm thấy trang</div>} />
    </Routes>
  );
};

export default AppRouter;
