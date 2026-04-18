import { KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      alert("Mật khẩu mới và Nhập lại mật khẩu không khớp!");
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Hồ Sơ Cá Nhân</h1>
        <p className="text-slate-400">Quản lý thông tin tài khoản và bảo mật</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái: Thông tin hiển thị */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700">
              <UserCircleIcon className="h-16 w-16 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-slate-400 mb-3">@{user.username}</p>
            <Badge variant={getRoleBadgeClass(role).replace('badge-', '')} className="px-3 py-1">
              {getRoleName(role)}
            </Badge>

            <div className="mt-6 w-full border-t border-slate-800 pt-4 text-left text-sm text-slate-300">
              <p className="mb-2"><strong className="text-slate-500">Email:</strong> {user.email}</p>
              <p className="mb-2"><strong className="text-slate-500">SĐT:</strong> {user.phone || 'Chưa cập nhật'}</p>
            </div>
          </Card>
        </div>

        {/* Cột phải: Form cập nhật */}
        <div className="lg:col-span-2">
          <Card title="Cập nhật thông tin & Mật khẩu">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Box Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-400 flex items-center">
                  <UserCircleIcon className="w-5 h-5 mr-2" /> Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* Box Đổi mật khẩu */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-emerald-400 flex items-center">
                  <KeyIcon className="w-5 h-5 mr-2" /> Đổi mật khẩu
                </h3>
                <p className="text-sm text-slate-500 mb-2">Bỏ trống nếu bạn không muốn thay đổi mật khẩu.</p>

                <Input
                  label="Mật khẩu hiện tại"
                  name="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Mật khẩu mới"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Nhập lại mật khẩu mới"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
