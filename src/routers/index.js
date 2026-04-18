import { Route, Routes } from 'react-router-dom';

// Guards
import PrivateRoute from '../components/guards/PrivateRoute';
import RoleGuard from '../components/guards/RoleGuard';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ExpensePage from '../pages/expenses/ExpensePage';
import InventoryPage from '../pages/inventory/InventoryPage';
import TransactionHistoryPage from '../pages/inventory/TransactionHistoryPage';
import ProductListPage from '../pages/products/ProductListPage';
import UserManagePage from '../pages/users/UserManagePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* App Routes (Private) */}
      <Route path="/" element={<PrivateRoute />}>

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
            <div className="flex h-screen items-center justify-center bg-slate-900 border-t border-slate-800"><h1 className="text-white text-2xl font-bold">Trang Báo Cáo Chi Tiết (Sắp ra mắt)</h1></div>
          </RoleGuard>
        } />

        {/* All Auth Users (Admin, Manager, Staff) */}
        <Route path="/products" element={<ProductListPage />} />

        <Route path="/inventory" element={
          <div className="flex flex-col h-full bg-slate-900">
            <div className="p-4 border-b border-slate-800 bg-slate-900">
              <h2 className="text-xl text-white font-bold mb-4">Danh Mục Quản Lý Kho</h2>
              <div className="flex gap-4">
                <a href="/inventory/manage" className="text-blue-400 hover:underline bg-slate-800 px-4 py-2 rounded-lg">Thực hiện Giao dịch Kho</a>
                <a href="/inventory/history" className="text-blue-400 hover:underline bg-slate-800 px-4 py-2 rounded-lg">Xem Lịch sử giao dịch</a>
              </div>
            </div>
          </div>
        } />

        <Route path="/inventory/manage" element={<InventoryPage />} />
        <Route path="/inventory/history" element={<TransactionHistoryPage />} />

      </Route>

      <Route path="*" element={<div className="flex justify-center items-center h-screen bg-slate-900 text-white text-3xl font-bold">404 - Không tìm thấy trang</div>} />
    </Routes>
  );
};

export default AppRouter;
