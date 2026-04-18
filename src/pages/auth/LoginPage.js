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

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(loginAction(username, password));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[100px]"></div>

      <Card className="w-full max-w-md relative z-10 border-slate-700 shadow-2xl">
        <div className="flex flex-col items-center pt-4 pb-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500 shadow-inner">
            <CubeIcon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Đăng nhập hệ thống</h2>
          <p className="mt-2 text-sm text-slate-400">Quản lý kho nội bộ VLXD DVN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tài khoản / Email"
            id="username"
            type="text"
            placeholder="Nhập tên đăng nhập hoặc email..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !username || !password}
              className="py-3 text-base font-semibold"
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
