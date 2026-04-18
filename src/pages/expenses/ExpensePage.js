import { ArchiveBoxIcon, ArrowUturnLeftIcon, EyeIcon, EyeSlashIcon, PaperClipIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
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

import { createExpenseAction, getExpensesAction, getHiddenExpensesAction, hideExpenseAction, restoreExpenseAction, updateExpenseAction } from '../../stores/redux/actions/expenseActions';
import { formatCurrency } from '../../utils/formatters';
import { EXPENSE_CATEGORIES, getExpenseCategoryName } from '../../utils/helpers';

const ExpensePage = () => {
  const dispatch = useDispatch();
  const { expenses, hiddenExpenses, loading } = useSelector((state) => state.expense);

  const [showHidden, setShowHidden] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [detailExpense, setDetailExpense] = useState(null);

  const [hideConfirmId, setHideConfirmId] = useState(null);
  const [restoreConfirmId, setRestoreConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'khac',
    date: new Date().toISOString().split('T')[0],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (showHidden) {
      dispatch(getHiddenExpensesAction());
    } else {
      dispatch(getExpensesAction());
    }
  }, [dispatch, showHidden]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const openCreateForm = () => {
    setEditingExpense(null);
    setFormData({
      title: '', description: '', amount: '', category: 'khac',
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedFiles([]);
    setIsFormOpen(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setSelectedFiles([]);
    setIsFormOpen(true);
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

    let res;
    if (editingExpense) {
      res = await dispatch(updateExpenseAction(editingExpense.id, form));
    } else {
      res = await dispatch(createExpenseAction(form));
    }

    if (res && res.success) {
      setIsFormOpen(false);
      openCreateForm();
    }
  };

  const handleHide = async () => {
    if (hideConfirmId) {
      await dispatch(hideExpenseAction(hideConfirmId));
      setHideConfirmId(null);
    }
  };

  const handleRestore = async () => {
    if (restoreConfirmId) {
      await dispatch(restoreExpenseAction(restoreConfirmId));
      setRestoreConfirmId(null);
    }
  };

  const currentData = showHidden ? hiddenExpenses : expenses;

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
      header: 'Hành Động',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {/* Nút Xem Chi Tiết (Luôn hiện) */}
          <Button size="sm" variant="ghost" onClick={() => setDetailExpense(row)} className="text-blue-400 hover:bg-blue-500/20">
            <EyeIcon className="h-4 w-4 mr-1" /> Xem
          </Button>

          {!showHidden ? (
            <>
              <Button size="sm" variant="outline" onClick={() => openEditForm(row)} className="px-2">
                <PencilSquareIcon className="h-4 w-4" title="Sửa" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setHideConfirmId(row.id)} className="text-red-400 hover:bg-red-500/20">
                <EyeSlashIcon className="h-5 w-5" title="Ẩn" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="success" onClick={() => setRestoreConfirmId(row.id)} className="px-2 text-emerald-400 hover:bg-emerald-500/20">
              <ArrowUturnLeftIcon className="h-4 w-4 mr-1" /> Khôi phục
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {showHidden ? 'Lưu Trữ Chi Phí' : 'Chi Phí Hoạt Động'}
          </h1>
          <p className="text-slate-400">
            {showHidden ? 'Danh sách các chi phí đã bị ẩn' : 'Theo dõi dòng tiền mua sắm và chi tiêu'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant={showHidden ? 'primary' : 'outline'}
            onClick={() => setShowHidden(!showHidden)}
            icon={showHidden ? null : <ArchiveBoxIcon />}
          >
            {showHidden ? 'Quay lại danh sách' : 'Xem Chi phí đã ẩn'}
          </Button>

          {!showHidden && (
            <Button icon={<PlusIcon />} onClick={openCreateForm}>
              Thêm Chi Phí
            </Button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={currentData}
        loading={loading}
        emptyMessage={showHidden ? "Không có dữ liệu trong lưu trữ" : "Chưa có khoản chi phí nào"}
      />

      {/* Modal Thêm / Sửa */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingExpense ? "Cập Nhật Chi Phí" : "Thêm Khoản Chi Mới"}>
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
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-600 focus:outline-none"
              />
              <PaperClipIcon className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-slate-500" />
            </div>
            {selectedFiles.length > 0 ? (
              <p className="mt-2 text-xs text-emerald-400">
                Đã chọn {selectedFiles.length} tệp đính kèm mới.
              </p>
            ) : editingExpense ? (
              <p className="mt-2 text-xs text-slate-500">
                Bỏ trống nếu không muốn thay đổi chứng từ cũ.
              </p>
            ) : null}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="mr-2 border border-slate-700">Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : (editingExpense ? 'Lưu Thay Đổi' : 'Lưu Chi Phí')}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Xem Chi Tiết Khoản Chi */}
      <Modal
        isOpen={!!detailExpense}
        onClose={() => setDetailExpense(null)}
        title="Chi Tiết Khoản Chi"
        maxWidth="max-w-2xl"
      >
        {detailExpense && (
          <div className="space-y-6">
            <div className="flex items-start justify-between border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{detailExpense.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={detailExpense.category === 'nhap_hang' ? 'blue' : 'gray'}>
                    {getExpenseCategoryName(detailExpense.category)}
                  </Badge>
                  <Badge variant="outline">
                    Ngày chi: {format(new Date(detailExpense.date), 'dd/MM/yyyy')}
                  </Badge>
                  <Badge variant={detailExpense.is_active ? 'green' : 'red'}>
                    {detailExpense.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-400">Số tiền</span>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(detailExpense.amount)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Mô tả / Lý do chi tiết:</h4>
              <div className="rounded-lg bg-slate-800/50 p-4 text-sm text-slate-300 whitespace-pre-wrap">
                {detailExpense.description || 'Không có mô tả chi tiết.'}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Chứng từ đính kèm:</h4>
              {(() => {
                let urls = [];
                try {
                  urls = JSON.parse(detailExpense.attachments) || [];
                } catch (e) { }

                if (urls.length > 0) {
                  return (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {urls.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-lg border border-slate-700 bg-slate-800 hover:opacity-80 transition-opacity relative group">
                          <img src={url} alt={`Chứng từ ${idx + 1}`} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-xs font-medium text-white">Xem ảnh lớn</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  );
                } else {
                  return <p className="text-sm text-slate-500 italic">Không có chứng từ đính kèm.</p>;
                }
              })()}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-700">
              <Button variant="ghost" onClick={() => setDetailExpense(null)}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!hideConfirmId}
        onClose={() => setHideConfirmId(null)}
        onConfirm={handleHide}
        title="Ẩn khoản chi phí"
        message="Khoản chi này sẽ được chuyển vào Kho lưu trữ. Bạn có chắc chắn?"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!restoreConfirmId}
        onClose={() => setRestoreConfirmId(null)}
        onConfirm={handleRestore}
        title="Khôi phục chi phí"
        message="Khoản chi phí này sẽ được khôi phục và tính toán lại vào báo cáo. Bạn có chắc chắn?"
        confirmText="Khôi phục"
        variant="success"
      />
    </MainLayout>
  );
};

export default ExpensePage;
