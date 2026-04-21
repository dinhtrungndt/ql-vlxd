import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  ChartBarIcon, ChartPieIcon,
  CubeIcon, UsersIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { role } = useAuth();

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

  // Tự động lọc menu dựa trên Role của người dùng hiện tại
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform flex flex-col border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo Area */}
        <div className="flex h-[72px] items-center justify-center border-b border-slate-800/80 px-6">
          <CubeIcon className="h-8 w-8 text-blue-500 mr-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            KHO DVN
          </h2>
        </div>

        {/* Navigation Area */}
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Menu Điều Hướng
          </p>
          <nav className="space-y-2">
            {filteredNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300 group ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 hover:translate-x-1'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="tracking-wide text-sm">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
