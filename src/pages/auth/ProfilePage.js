import { CheckBadgeIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

import { useAuth } from '../../hooks/useAuth';
import { updateProfileAction } from '../../stores/redux/actions/authActions';
import { getRoleBadgeClass, getRoleName } from '../../utils/helpers';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, role } = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      toast.error("Mật khẩu mới và Xác nhận mật khẩu không khớp!");
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
    };

    if (formData.new_password) {
      payload.current_password = formData.current_password;
      payload.new_password = formData.new_password;
    }

    const res = await dispatch(updateProfileAction(payload));
    if (res && res.success) {
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Hồ Sơ Cá Nhân</h1>
        <p className="mt-1 text-slate-400">Quản lý thông tin định danh và thiết lập bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cột trái: Card hiển thị thông tin */}
        <div className="lg:col-span-4">
          <Card className="relative overflow-hidden border-slate-800/50 bg-slate-900/50 backdrop-blur-md pt-12 pb-8 shadow-2xl" noPadding>
            {/* Hiệu ứng Glow nền */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-600/10 blur-[50px]"></div>

            <div className="flex flex-col items-center relative z-10 px-6">
              <div className="relative mb-6 group cursor-default">
                <div className="h-32 w-32 rounded-[2rem] bg-slate-800 border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                  <UserCircleIcon className="h-20 w-20 text-slate-500 transition-colors duration-500 group-hover:text-blue-400" />
                </div>
                <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full border-4 border-slate-900 bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <CheckBadgeIcon className="h-5 w-5 text-slate-900" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight text-center">{user.name}</h2>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1 mb-5">@{user.username}</p>

              <Badge variant={getRoleBadgeClass(role).replace('badge-', '')} className="px-4 py-1.5 shadow-lg uppercase font-black tracking-widest text-[10px]">
                {getRoleName(role)}
              </Badge>

              <div className="mt-8 w-full space-y-4 rounded-2xl bg-slate-800/40 p-5 border border-slate-700/50">
                <div className="flex flex-col border-b border-slate-700/50 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email liên hệ</span>
                  <span className="text-sm font-medium text-white truncate">{user.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Số điện thoại di động</span>
                  <span className="text-sm font-medium text-white">{user.phone || <span className="text-slate-500 italic">Chưa cập nhật</span>}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Cột phải: Form cập nhật */}
        <div className="lg:col-span-8">
          <Card title="Chỉnh Sửa Hồ Sơ" className="border-slate-800/50 bg-slate-900/30" headerClassName="border-b border-slate-800 pb-4">
            <form onSubmit={handleSubmit} className="space-y-8 p-2">

              {/* Phân mục Thông tin cơ bản */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                    <UserCircleIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Thông tin định danh</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ và tên đầy đủ *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên..."
                  />
                  <Input
                    label="Số điện thoại liên lạc"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx"
                  />
                </div>
              </div>

              {/* Đường kẻ phân cách */}
              <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700/50 to-transparent"></div>

              {/* Phân mục Đổi mật khẩu */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                    <KeyIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Thiết lập bảo mật</h3>
                    <p className="text-xs text-slate-500 mt-1 italic">Bỏ trống các trường dưới đây nếu bạn không muốn thay đổi mật khẩu.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="md:w-1/2 pr-0 md:pr-3">
                    <Input
                      label="Mật khẩu hiện tại"
                      name="current_password"
                      type="password"
                      value={formData.current_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Mật khẩu mới"
                      name="new_password"
                      type="password"
                      value={formData.new_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <Input
                      label="Xác nhận mật khẩu mới"
                      name="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Nhóm Nút Lưu/Hủy */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={loading}
                  className="text-slate-400 hover:text-white px-6"
                >
                  Khôi phục gốc
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="px-10 shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang lưu...</span>
                    </div>
                  ) : (
                    'Lưu Cập Nhật'
                  )}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
