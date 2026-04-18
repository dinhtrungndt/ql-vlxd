import { LockClosedIcon, LockOpenIcon, PencilSquareIcon, ShieldCheckIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
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

  const columns = [
    {
      header: 'Nhân Sự',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${row.role === 'admin' ? 'border-red-500 bg-red-500/20 text-red-500' : 'border-slate-600 bg-slate-800 text-slate-400'}`}>
            {row.role === 'admin' ? <ShieldCheckIcon className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
          </div>
          <div>
            <div className="font-semibold text-white">{row.name}</div>
            <div className="text-xs text-slate-400">@{row.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Liên Hệ',
      accessor: 'email',
      render: (row) => (
        <div>
          <div className="text-sm text-slate-300">{row.email}</div>
          <div className="text-xs text-slate-500">{row.phone || 'Chưa cập nhật SĐT'}</div>
        </div>
      ),
    },
    {
      header: 'Phân Quyền',
      accessor: 'role',
      render: (row) => (
        <Badge variant={getRoleBadgeClass(row.role).replace('badge-', '')}>
          {getRoleName(row.role)}
        </Badge>
      ),
    },
    {
      header: 'Trạng Thái',
      accessor: 'is_active',
      render: (row) => (
        <Badge variant={row.is_active ? 'green' : 'red'}>
          {row.is_active ? 'Đang hoạt động' : 'Đã khóa'}
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
          <div className="flex justify-end gap-2">
            {canEditThisUser && (
              <Button size="sm" variant="outline" onClick={() => openEditForm(row)} className="px-2">
                <PencilSquareIcon className="h-4 w-4" title="Sửa" />
              </Button>
            )}

            {canLockThisUser && (
              <Button
                size="sm"
                variant={row.is_active ? "danger" : "success"}
                onClick={() => {
                  setConfirmToggleId(row.id);
                  setConfirmToggleStatus(row.is_active);
                }}
                className="px-2"
              >
                {row.is_active ? <LockClosedIcon className="h-4 w-4" title="Khóa" /> : <LockOpenIcon className="h-4 w-4" title="Mở khóa" />}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản Lý Nhân Sự</h1>
          <p className="text-slate-400">Danh sách tài khoản nội bộ và phân quyền</p>
        </div>
        <Button icon={<UserPlusIcon />} onClick={openCreateForm}>
          Tạo Tài Khoản
        </Button>
      </div>

      <div className="mb-6">
        <Table
          columns={columns}
          data={users}
          loading={loadingList}
          emptyMessage="Chưa có dữ liệu nhân sự"
        />
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingUser ? "Cập Nhật Thông Tin" : "Tạo Tài Khoản Mới"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Họ tên *" name="name" value={formData.name} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" />
            <Input
              label="Tên đăng nhập *"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={!!editingUser}
              helperText={editingUser ? "Không thể thay đổi tên đăng nhập" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!editingUser} // Không cho đổi email khi sửa
            />
            <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} placeholder="0909..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={editingUser ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu *"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingUser}
              placeholder="••••••••"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Quyền truy cập *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!!editingUser}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
              >
                <option value="staff">Nhân viên / Thủ kho</option>
                {isAdmin && <option value="manager">Quản lý kho</option>}
                {isAdmin && <option value="admin">Giám Đốc (Admin)</option>}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
            <Button variant="ghost" onClick={() => setIsFormOpen(false)} disabled={loadingAction}>Hủy</Button>
            <Button type="submit" variant="primary" disabled={loadingAction}>
              {loadingAction ? 'Đang xử lý...' : (editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản')}
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
          ? "Tài khoản này sẽ bị cấm đăng nhập vào hệ thống. Bạn có chắc chắn?"
          : "Tài khoản này sẽ được phép đăng nhập lại bình thường. Bạn đồng ý chứ?"}
        confirmText={confirmToggleStatus ? "Khóa ngay" : "Mở khóa"}
        variant={confirmToggleStatus ? "danger" : "success"}
      />
    </MainLayout>
  );
};

export default UserManagePage;
