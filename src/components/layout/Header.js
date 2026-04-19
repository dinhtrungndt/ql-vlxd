import { ArrowRightOnRectangleIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutAction } from '../../stores/redux/actions/authActions';
import { getRoleBadgeClass, getRoleName } from '../../utils/helpers';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user, role } = useAuth();

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 backdrop-blur-xl shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center text-slate-300">
        <button
          onClick={onMenuClick}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-400 transition-all hover:bg-slate-700 hover:text-white lg:hidden focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {user && (
          <div className="hidden items-center gap-4 sm:flex border-r border-slate-800/80 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-white tracking-wide">{user.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${getRoleBadgeClass(role).replace('badge-', 'text-')}`}>
                {getRoleName(role)}
              </span>
            </div>
            {/* Avatar Placeholder */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-lg font-black text-blue-400 shadow-inner">
              {user.name.charAt(0)}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Nút Hồ Sơ */}
          <Link
            to="/profile"
            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 text-sm font-bold text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            title="Hồ sơ cá nhân"
          >
            <UserIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Hồ Sơ</span>
          </Link>

          {/* Nút Đăng Xuất */}
          <button
            onClick={handleLogout}
            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            title="Đăng xuất"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Thoát</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
