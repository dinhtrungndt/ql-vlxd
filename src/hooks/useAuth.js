import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading, token } = useSelector((state) => state.auth);
  
  return {
    user,
    isAuthenticated,
    loading,
    token,
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isStaff: user?.role === 'staff',
  };
};
