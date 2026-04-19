import { CubeIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { loginAction } from '../../stores/redux/actions/authActions';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      let from = location.state?.from?.pathname;

      if (user.role === 'staff') {
        const forbiddenPaths = ['/', '/users', '/reports', '/expenses'];
        if (!from || forbiddenPaths.includes(from)) {
          from = '/inventory';
        }
      } else {
        if (!from || from === '/') {
          from = '/';
        }
      }

      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(loginAction(username, password));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-emerald-600/30 blur-[120px] animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border border-slate-700/50 shadow-2xl rounded-2xl backdrop-blur-md bg-slate-800/70 transition-transform hover:scale-[1.01]">
        <div className="flex flex-col items-center pt-6 pb-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500 shadow-inner">
            <CubeIcon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Đăng nhập hệ thống</h2>
          <p className="mt-2 text-sm text-slate-400">Quản lý kho nội bộ VLXD DVN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-4">
          <Input
            label="Tài khoản / Email"
            id="username"
            type="text"
            placeholder="Nhập tên đăng nhập hoặc email..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="focus:ring-2 focus:ring-blue-500"
          />

          <Input
            label="Mật khẩu"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="focus:ring-2 focus:ring-blue-500"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !username || !password}
              className="py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
