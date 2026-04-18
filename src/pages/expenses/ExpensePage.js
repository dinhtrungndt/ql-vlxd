import { EyeSlashIcon, PaperClipIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';

import { createExpenseAction, getExpensesAction, hideExpenseAction } from '../../stores/redux/actions/expenseActions';
import { formatCurrency } from '../../utils/formatters';
import { EXPENSE_CATEGORIES, getExpenseCategoryName } from '../../utils/helpers';

const ExpensePage = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expense);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hideConfirmId, setHideConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'khac',
    date: new Date().toISOString().split('T')[0],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    dispatch(getExpensesAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    selectedFiles.forEach(file => {
      form.append('files', file);
    });

    const res = await dispatch(createExpenseAction(form));
    if (res && res.success) {
      setIsFormOpen(false);
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'khac',
        date: new Date().toISOString().split('T')[0],
      });
      setSelectedFiles([]);
    }
  };

  const handleHide = async () => {
    if (hideConfirmId) {
      await dispatch(hideExpenseAction(hideConfirmId));
      setHideConfirmId(null);
    }
  };

  const columns = [
    {
      header: 'Ngày',
      accessor: 'date',
      render: (row) => format(new Date(row.date), 'dd/MM/yyyy'),
    },
    {
      header: 'Tiêu Đề',
      accessor: 'title',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.title}</p>
          {row.description && <p className="mt-1 line-clamp-1 text-xs text-slate-400">{row.description}</p>}
        </div>
      ),
    },
    {
      header: 'Danh Mục',
      accessor: 'category',
      render: (row) => (
        <Badge variant={row.category === 'nhap_hang' ? 'blue' : 'gray'}>
          {getExpenseCategoryName(row.category)}
        </Badge>
      ),
    },
    {
      header: 'Số Tiền',
      accessor: 'amount',
      render: (row) => <span className="font-bold text-red-400">{formatCurrency(row.amount)}</span>,
    },
    {
      header: '',
      accessor: 'actions',
      className: 'w-20',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => setHideConfirmId(row.id)} className="text-red-400 hover:bg-red-500/20">
          <EyeSlashIcon className="h-5 w-5" title="Ẩn" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Chi Phí Hoạt Động</h1>
          <p className="text-slate-400">Theo dõi dòng tiền mua sắm và chi tiêu</p>
        </div>
        <Button icon={<PlusIcon />} onClick={() => setIsFormOpen(true)}>
          Thêm Chi Phí
        </Button>
      </div>

      <Table
        columns={columns}
        data={expenses}
        loading={loading}
        emptyMessage="Chưa có khoản chi phí nào"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Thêm Khoản Chi Mới">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tiêu đề khoản chi *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="VD: Trả tiền bốc xếp..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số tiền (VNĐ) *"
              name="amount"
              type="number"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Ngày chi *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Danh mục *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Mô tả thêm / Lý do</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Đính kèm chứng từ/hóa đơn</label>
            <div className="relative flex w-full items-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-600 focus:outline-none"
              />
              <PaperClipIcon className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-slate-500" />
            </div>
            {selectedFiles.length > 0 && (
              <p className="mt-2 text-xs text-emerald-400">
                Đã chọn {selectedFiles.length} tệp đính kèm.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="mr-2 border border-slate-700">Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu Chi Phí'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!hideConfirmId}
        onClose={() => setHideConfirmId(null)}
        onConfirm={handleHide}
        title="Ẩn khoản chi phí"
        message="Khoản chi này sẽ không hiển thị trên danh sách và báo cáo nữa."
      />
    </MainLayout>
  );
};

export default ExpensePage;
