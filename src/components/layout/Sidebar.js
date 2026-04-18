import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  ChartBarIcon, ChartPieIcon,
  CubeIcon, UsersIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { role, isAdmin, isManager } = useAuth();

  const navItems = [
    {
      name: 'Tổng quan',
      path: '/',
      icon: <ChartPieIcon className="w-5 h-5" />,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Quản lý kho',
      path: '/inventory',
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Danh mục Vật tư',
      path: '/products',
      icon: <CubeIcon className="w-5 h-5" />,
      roles: ['admin', 'manager', 'staff'],
    },
    {
      name: 'Chi phí nội bộ',
      path: '/expenses',
      icon: <BanknotesIcon className="w-5 h-5" />,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Báo cáo',
      path: '/reports',
      icon: <ChartBarIcon className="w-5 h-5" />,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Nhân sự',
      path: '/users',
      icon: <UsersIcon className="w-5 h-5" />,
      roles: ['admin', 'manager'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <CubeIcon className="h-8 w-8 text-blue-500 mr-2" />
          <h2 className="text-lg font-bold text-white tracking-wider">DVN VLXD</h2>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {filteredNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="mr-3">{item.icon}</div>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
