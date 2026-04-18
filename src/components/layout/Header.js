import React from 'react';
import { useDispatch } from 'react-redux';
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { logoutAction } from '../../stores/redux/actions/authActions';
import { getRoleName, getRoleBadgeClass } from '../../utils/helpers';
import Badge from '../ui/Badge';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user, role } = useAuth();

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center text-slate-300">
        <button
          onClick={onMenuClick}
          className="mr-4 rounded-lg p-1 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span className="text-sm font-medium lg:hidden">Menu</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden flex-col items-end sm:flex text-right mr-2">
            <span className="text-sm font-semibold text-white">{user.name}</span>
            <Badge variant={getRoleBadgeClass(role).replace('badge-', '')} className="mt-0.5">
              {getRoleName(role)}
            </Badge>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white hover:text-red-400 transition-colors"
          title="Đăng xuất"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
