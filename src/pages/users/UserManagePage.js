import {
  CheckBadgeIcon, KeyIcon, LockClosedIcon, LockOpenIcon, PencilSquareIcon, ShieldCheckIcon,
  UserGroupIcon, UserIcon, UserPlusIcon
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';

import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { createEmployeeAction, toggleUserStatusAction, updateEmployeeAction } from '../../stores/redux/actions/authActions';
import { getRoleBadgeClass, getRoleName } from '../../utils/helpers';

const UserManagePage = () => {
  const dispatch = useDispatch();
  const { isAdmin, isManager, user: currentUser } = useAuth();
  const loadingAction = useSelector((state) => state.auth.loading);

  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [confirmToggleId, setConfirmToggleId] = useState(null);
  const [confirmToggleStatus, setConfirmToggleStatus] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
  });

  const fetchUsers = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách nhân sự');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData({
      username: '', name: '', email: '', password: '', phone: '', role: 'staff',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
    });
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res;
    if (editingUser) {
      // Logic Sửa
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
      };
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      res = await dispatch(updateEmployeeAction(editingUser.id, updatePayload));
    } else {
      res = await dispatch(createEmployeeAction(formData));
    }

    if (res && res.success) {
      setIsFormOpen(false);
      fetchUsers();
    }
  };

  const handleToggleStatus = async () => {
    if (confirmToggleId) {
      const res = await dispatch(toggleUserStatusAction(confirmToggleId));
      if (res && res.success) {
        fetchUsers();
      }
      setConfirmToggleId(null);
    }
  };

  // Tính toán thống kê
  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin' || u.role === 'manager').length || 0,
    active: users?.filter(u => u.is_active).length || 0,
  };

  const columns = [
    {
      header: 'Nhân Sự Hệ Thống',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${row.role === 'admin'
                ? 'border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : row.role === 'manager'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}>
              {row.role === 'admin' ? <ShieldCheckIcon className="h-7 w-7" /> : <UserIcon className="h-7 w-7" />}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${row.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
          </div>
          <div>
            <div className="font-black text-white leading-none mb-1">{row.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">@{row.username}</span>
              <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${getRoleBadgeClass(row.role).replace('badge-', 'text-')}`}>
                {getRoleName(row.role)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Thông Tin Liên Hệ',
      accessor: 'email',
      render: (row) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-slate-300">{row.email}</div>
          <div className="text-xs text-slate-500 font-mono italic">{row.phone || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Trạng Thái Truy Cập',
      accessor: 'is_active',
      render: (row) => (
        <Badge variant={row.is_active ? 'green' : 'red'} className="px-3 py-1 font-black uppercase text-[10px] tracking-widest">
          {row.is_active ? 'Đang hoạt động' : 'Tài khoản khóa'}
        </Badge>
      ),
    },
    {
      header: 'Hành Động',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => {
        const canEditThisUser = isAdmin || (isManager && row.role !== 'admin');
        const canLockThisUser = isAdmin && row.id !== currentUser.id;

        return (
          <div className="flex justify-end gap-1">
            {canEditThisUser && (
              <Button size="sm" variant="ghost" onClick={() => openEditForm(row)} className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                <PencilSquareIcon className="h-4 w-4" />
              </Button>
            )}

            {canLockThisUser && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setConfirmToggleId(row.id);
                  setConfirmToggleStatus(row.is_active);
                }}
                className={row.is_active ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}
              >
                {row.is_active ? <LockClosedIcon className="h-4 w-4" /> : <LockOpenIcon className="h-4 w-4" />}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white line-gradient">Quản Lý Nhân Sự</h1>
          <p className="mt-1 text-slate-400">Điều hành và phân quyền truy cập hệ thống Kho DVN</p>
        </div>
        <Button
          variant="primary"
          icon={<UserPlusIcon className="h-4 w-4" />}
          onClick={openCreateForm}
          className="shadow-lg shadow-blue-600/20 px-8"
        >
          Khai Báo Tài Khoản Mới
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Tổng đội ngũ"
          value={stats.total}
          icon={<UserGroupIcon className="h-6 w-6" />}
          colorClass="bg-blue-600/5 border-blue-500/10 text-blue-500"
          delay="animate-in fade-in slide-in-from-bottom-2 duration-300"
        />
        <StatCard
          title="Vai trò bảo mật"
          value={stats.admins}
          icon={<ShieldCheckIcon className="h-6 w-6" />}
          colorClass="bg-amber-600/5 border-amber-500/10 text-amber-500"
          delay="animate-in fade-in slide-in-from-bottom-2 duration-500"
        />
        <StatCard
          title="Đang hoạt động"
          value={stats.active}
          icon={<CheckBadgeIcon className="h-6 w-6" />}
          colorClass="bg-emerald-600/5 border-emerald-500/10 text-emerald-500"
          delay="animate-in fade-in slide-in-from-bottom-2 duration-700"
        />
      </div>

      <Table
        columns={columns}
        data={users}
        loading={loadingList}
        emptyMessage="Chưa có dữ liệu nhân sự trong hệ thống"
        className="border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl"
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? "Cập Nhật Hồ Sơ Nhân Sự" : "Cấp Tài Khoản Hệ Thống"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Định danh nhân sự</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Họ và tên đầy đủ *" name="name" value={formData.name} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" />
              <Input
                label="Tên đăng nhập (ID) *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={!!editingUser}
                placeholder="nv_van_a"
                helperText={editingUser ? "ID nhân sự không thể thay đổi" : ""}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Thông tin liên lạc</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email công việc *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!editingUser}
                placeholder="name@dvn.vn"
              />
              <Input label="Số điện thoại di động" name="phone" value={formData.phone} onChange={handleChange} placeholder="09xx xxx xxx" />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Bảo mật & Phân quyền</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <div className="relative group">
                <div className="absolute left-3 top-[34px] text-slate-500 group-focus-within:text-blue-500 z-10">
                  <KeyIcon className="h-4 w-4" />
                </div>
                <Input
                  label={editingUser ? "Mật khẩu mới (Nếu có)" : "Thiết lập mật khẩu *"}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò truy cập *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!!editingUser}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="staff" className="bg-slate-800">Nhân viên / Thủ kho</option>
                  {isAdmin && <option value="manager" className="bg-slate-800">Quản lý kho</option>}
                  {isAdmin && <option value="admin" className="bg-slate-800">Giám Đốc (Admin)</option>}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-800">
            <p className="mr-auto text-[10px] text-slate-500 italic">Dấu (*) là các trường bắt buộc phải có thông tin</p>
            <Button variant="ghost" onClick={() => setIsFormOpen(false)} disabled={loadingAction} className="text-slate-400 hover:text-white px-6">
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loadingAction}
              className="px-10 shadow-lg shadow-blue-600/20"
            >
              {loadingAction ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (editingUser ? 'Lưu cập nhật hồ sơ' : 'Xác nhận cấp tài khoản')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmToggleId}
        onClose={() => setConfirmToggleId(null)}
        onConfirm={handleToggleStatus}
        title={confirmToggleStatus ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={confirmToggleStatus
          ? "Tài khoản này sẽ bị thu hồi quyền truy cập vào hệ thống ngay lập tức. Bạn có chắc chắn?"
          : "Tài khoản này sẽ được khôi phục quyền đăng nhập và thao tác bình thường. Tiếp tục?"}
        confirmText={confirmToggleStatus ? "Xác nhận khóa" : "Mở khóa ngay"}
        variant={confirmToggleStatus ? "danger" : "success"}
      />
    </MainLayout>
  );
};

// Re-using the StatCard internal component with better styling
const StatCard = ({ title, value, icon, colorClass, delay = "" }) => (
  <Card className={`relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] ${colorClass} ${delay}`}>
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className="rounded-xl bg-white/5 p-3 shadow-lg border border-white/10 group-hover:bg-white/10 transition-all duration-300">
        {icon}
      </div>
    </div>
  </Card>
);

export default UserManagePage;
