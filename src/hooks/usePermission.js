import { useAuth } from './useAuth';
import { canAccess } from '../utils/helpers';

export const usePermission = () => {
  const { role } = useAuth();

  const hasPermission = (requiredRoles) => {
    return canAccess(role, requiredRoles);
  };

  return { hasPermission };
};
