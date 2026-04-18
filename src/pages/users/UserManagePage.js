import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlusIcon } from '@heroicons/react/24/outline';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { createEmployeeAction } from '../../stores/redux/actions/authActions';
import { useAuth } from '../../hooks/useAuth';

const UserManagePage = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(createEmployeeAction(formData));
    if (res && res.success) {
      setIsFormOpen(false);
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'staff',
      });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản Lý Nhân Sự</h1>
          <p className="text-slate-400">Tạo tài khoản nội bộ cho nhân viên</p>
        </div>
        <Button icon={<UserPlusIcon />} onClick={() => setIsFormOpen(true)}>
          Tạo Tài Khoản
        </Button>
      </div>

      <Card>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-slate-800 p-4 shadow-inner">
            <UserPlusIcon className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-white">Chưa có danh sách nhân viên</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Hiện tại hệ thống chỉ hỗ trợ chức năng tạo tài khoản. Chọn nút "Tạo Tài Khoản" góc phải để thêm nhân sự vào hệ thống.
          </p>
        </div>
      </Card>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Tạo Tài Khoản Nhân Viên">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Họ tên *" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Tên đăng nhập *" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Mật khẩu *" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Quyền truy cập *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="staff">Nhân viên / Thủ kho</option>
                {isAdmin && <option value="manager">Quản lý kho</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="mr-2">Hủy</Button>
             <Button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default UserManagePage;
