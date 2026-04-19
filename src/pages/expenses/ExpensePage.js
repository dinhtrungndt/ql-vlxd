import {
  ArchiveBoxIcon, ArrowUturnLeftIcon, BanknotesIcon, CalendarDaysIcon, DocumentCheckIcon, EyeIcon, EyeSlashIcon,
  PaperClipIcon, PencilSquareIcon, PlusIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { format, isSameMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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

  // Tính toán thống kê
  const stats = {
    total: currentData?.reduce((acc, exp) => acc + exp.amount, 0) || 0,
    monthly: expenses?.filter(exp => isSameMonth(new Date(exp.date), new Date())).reduce((acc, exp) => acc + exp.amount, 0) || 0,
    docsCount: currentData?.filter(exp => {
      try { return (JSON.parse(exp.attachments) || []).length > 0; } catch(e) { return false; }
    }).length || 0,
  };

  const columns = [
    {
      header: 'Ngày Chi',
      accessor: 'date',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{format(new Date(row.date), 'dd/MM/yyyy')}</span>
          <span className="text-[10px] text-slate-500 uppercase font-black">{format(new Date(row.date), 'EEEE')}</span>
        </div>
      ),
    },
    {
      header: 'Nội Dung Chi Phí',
      accessor: 'title',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-bold text-white leading-tight">{row.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={row.category === 'nhap_hang' ? 'blue' : 'gray'} className="text-[10px] py-0 px-1.5 uppercase font-black">
              {getExpenseCategoryName(row.category)}
            </Badge>
            {row.description && <span className="line-clamp-1 text-[10px] text-slate-500 italic">{row.description}</span>}
          </div>
        </div>
      ),
    },
    {
      header: 'Số Tiền',
      accessor: 'amount',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span className="font-mono font-black text-red-400 text-lg">-{formatCurrency(row.amount)}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
             {(() => {
               try {
                 const count = JSON.parse(row.attachments)?.length || 0;
                 return count > 0 ? <><PaperClipIcon className="h-3 w-3" /> {count} chứng từ</> : null;
               } catch(e) { return null; }
             })()}
          </div>
        </div>
      ),
    },
    {
      header: 'Hành Động',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => setDetailExpense(row)} className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
            <EyeIcon className="h-4 w-4" />
          </Button>

          {!showHidden ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => openEditForm(row)} className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                <PencilSquareIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setHideConfirmId(row.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <EyeSlashIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="success" onClick={() => setRestoreConfirmId(row.id)} className="text-emerald-400">
              <ArrowUturnLeftIcon className="h-4 w-4 mr-1" /> Khôi phục
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white line-gradient">
            {showHidden ? 'Lưu Trữ Chi Phí' : 'Chi Phí Hoạt Động'}
          </h1>
          <p className="mt-1 text-slate-400">
            {showHidden ? 'Danh sách các khoản chi đã bị ẩn khỏi báo cáo' : 'Theo dõi biến động dòng tiền mua sắm và chi tiêu Kho DVN'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowHidden(!showHidden)}
            className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            icon={showHidden ? null : <ArchiveBoxIcon className="h-4 w-4" />}
          >
            {showHidden ? 'Quay lại danh sách' : 'Kho Lưu Trữ'}
          </Button>

          {!showHidden && (
            <Button 
              variant="primary" 
              icon={<PlusIcon className="h-4 w-4" />} 
              onClick={openCreateForm}
              className="shadow-lg shadow-blue-600/20"
            >
              Thêm Khoản Chi Mới
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="bg-red-600/5 border-red-500/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BanknotesIcon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tổng chi phí ({showHidden ? 'Kho ẩn' : 'Hiện hành'})</p>
              <h4 className="text-2xl font-black text-white">{formatCurrency(stats.total)}</h4>
            </div>
          </div>
        </Card>
        <Card className="bg-amber-600/5 border-amber-500/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarDaysIcon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chi tiêu tháng này</p>
              <h4 className="text-2xl font-black text-white">{formatCurrency(stats.monthly)}</h4>
            </div>
          </div>
        </Card>
        <Card className="bg-blue-600/5 border-blue-500/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DocumentCheckIcon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
              <DocumentCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hồ sơ chứng từ</p>
              <h4 className="text-2xl font-black text-white">{stats.docsCount} <span className="text-xs font-medium text-slate-500 uppercase tracking-normal">Bản scan</span></h4>
            </div>
          </div>
        </Card>
      </div>

      <Table
        columns={columns}
        data={currentData}
        loading={loading}
        emptyMessage={showHidden ? "Không có dữ liệu trong kho lưu trữ" : "Hệ thống chưa ghi nhận khoản chi phí nào"}
        className="border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl"
      />

      {/* Modal Thêm / Sửa */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingExpense ? "Cập Nhật Khoản Chi" : "Khai Báo Khoản Chi Mới"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Input
              label="Tiêu đề / Mục đích khoản chi *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="VD: Trả tiền bốc xếp xi măng, Mua văn phòng phẩm..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input
                label="Số tiền thực chi (VNĐ) *"
                name="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày thực hiện chi *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục phân loại *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value} className="bg-slate-800 text-white">{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">Ghi chú chi tiết / Lý do</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              placeholder="Thông tin bổ sung về khoản chi này..."
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">Chứng từ / Hóa đơn đính kèm</label>
            <div className="relative group p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <PaperClipIcon className="h-8 w-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm font-medium text-slate-400">Tải lên chứng từ ảnh</p>
                <p className="text-[10px] text-slate-500 italic">Có thể chọn nhiều tệp cùng lúc (Max 5MB/file)</p>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((f, i) => (
                  <Badge key={i} variant="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1">
                    {f.name}
                  </Badge>
                ))}
              </div>
            )}
            {editingExpense && !selectedFiles.length && (
              <p className="text-[10px] text-slate-500 italic px-2">
                ※ Để trống nếu không muốn thay đổi các chứng từ đã có.
              </p>
            )}
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-800">
            <p className="mr-auto text-[10px] text-slate-500 italic">Các trường có (*) là bắt buộc</p>
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-10 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (editingExpense ? 'Lưu cập nhật' : 'Xác nhận khoản chi')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Xem Chi Tiết Khoản Chi */}
      <Modal
        isOpen={!!detailExpense}
        onClose={() => setDetailExpense(null)}
        title="Chi Tiết Giao Dịch Khoản Chi"
        maxWidth="max-w-3xl"
      >
        {detailExpense && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <BanknotesIcon className="h-20 w-20 text-red-500" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight">{detailExpense.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={detailExpense.category === 'nhap_hang' ? 'blue' : 'gray'} className="px-3 py-1 font-black">
                      {getExpenseCategoryName(detailExpense.category)}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-400 px-3 py-1">
                      Ngày chi: {format(new Date(detailExpense.date), 'dd/MM/yyyy')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mô tả / Lý do</span>
                   <div className="text-sm text-slate-400 leading-relaxed italic">
                     {detailExpense.description || 'Hệ thống không ghi nhận mô tả chi tiết cho khoản chi này.'}
                   </div>
                </div>
              </div>
              
              <div className="text-right md:min-w-[200px] p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tổng tiền mặt</span>
                <p className="text-3xl font-black text-red-400 tracking-tighter">-{formatCurrency(detailExpense.amount)}</p>
                <div className="mt-2 flex items-center justify-end gap-2 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                   ID: {detailExpense.id?.split('-')[0]} • Status: <span className={detailExpense.is_active ? 'text-emerald-500' : 'text-red-500'}>{detailExpense.is_active ? 'ACTIVE' : 'ARCHIVED'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center text-[10px] font-black text-blue-400 uppercase tracking-widest px-2">
                <PaperClipIcon className="mr-2 h-4 w-4" />
                Hồ sơ chứng từ kế toán
              </h4>
              {(() => {
                let urls = [];
                try {
                  urls = JSON.parse(detailExpense.attachments) || [];
                } catch (e) { }

                if (urls.length > 0) {
                  return (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {urls.map((url, idx) => (
                        <a 
                          key={idx} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block aspect-square overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-800 hover:border-blue-500/50 transition-all relative group shadow-lg"
                        >
                          <img src={url} alt={`Chứng từ ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 p-4 text-center">
                            <PlusIcon className="h-8 w-8 text-white mb-2" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Xem bản gốc</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-slate-800 text-slate-600 italic text-sm">
                       Không có file đính kèm kèm tài liệu.
                    </div>
                  );
                }
              })()}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setDetailExpense(null)} className="px-8 text-slate-400 hover:text-white">
                Đóng chi tiết
              </Button>
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
