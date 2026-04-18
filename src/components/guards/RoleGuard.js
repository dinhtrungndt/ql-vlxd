import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { canAccess } from '../../utils/helpers';

const RoleGuard = ({ requireRoles, children }) => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!canAccess(role, requireRoles)) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-slate-700">403</h1>
        <p className="mt-4 text-xl text-slate-400">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
