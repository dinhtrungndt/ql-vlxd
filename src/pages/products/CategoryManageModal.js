import { CheckIcon, PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { createCategoryAction, deleteCategoryAction, getCategoriesAction, renameCategoryAction } from '../../stores/redux/actions/productActions';

const CategoryManageModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories, loading: productLoading } = useSelector((state) => state.product);

  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null); // Lưu Object danh mục cần xóa
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addCategoryName, setAddCategoryName] = useState('');

  useEffect(() => {
    if (isOpen) {
      dispatch(getCategoriesAction());
    }
  }, [dispatch, isOpen]);

  const handleEditClick = (cat) => {
    setEditingCategory(cat.id);
    setNewCategoryName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (!newCategoryName.trim()) {
      setEditingCategory(null);
      return;
    }
    setLoading(true);
    const res = await dispatch(renameCategoryAction(editingCategory, newCategoryName));
    if (res && res.success) {
      setEditingCategory(null);
    }
    setLoading(false);
  };

  const handleDeleteClick = async () => {
    if (deleteConfirmCat) {
      setLoading(true);
      const res = await dispatch(deleteCategoryAction(deleteConfirmCat.id));
      if (res && res.success) {
        setDeleteConfirmCat(null);
      }
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!addCategoryName.trim()) return;
    setLoading(true);
    const res = await dispatch(createCategoryAction(addCategoryName));
    if (res && res.success) {
      setAddCategoryName('');
      setShowAddForm(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Quản Lý Danh Mục Nội Bộ"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400 italic">
            Khi bạn đổi tên một danh mục, hệ thống sẽ tự động cập nhật hàng loạt cho tất cả các vật tư đang sử dụng danh mục đó.
          </p>

          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-blue-600/5 border border-blue-500/20">
            {showAddForm ? (
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Nhập tên danh mục mới..."
                  value={addCategoryName}
                  onChange={(e) => setAddCategoryName(e.target.value)}
                  className="mb-0 flex-1 border-blue-500/50"
                  autoFocus
                />
                <Button size="sm" variant="success" onClick={handleAddCategory} disabled={loading}>
                  Xác nhận
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)} disabled={loading}>
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Khai báo danh mục mới</span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<PlusIcon className="h-4 w-4" />}
                  onClick={() => setShowAddForm(true)}
                  className="px-4"
                >
                  Thêm mới
                </Button>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
            <ul className="divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {categories.length === 0 && !productLoading && (
                <li className="p-6 text-center text-slate-500">Chưa có danh mục nào trong hệ thống.</li>
              )}
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors">
                  {editingCategory === cat.id ? (
                    <div className="flex-1 flex items-center gap-3 pr-4">
                      <Input
                        name="newCategoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="mb-0 flex-1 border-blue-500/50 focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <Button size="sm" variant="success" onClick={handleSaveEdit} disabled={loading} className="px-3">
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)} disabled={loading} className="px-3 text-slate-400 hover:text-white">
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-blue-400">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(cat)} className="text-emerald-400 hover:bg-emerald-500/10">
                          <PencilSquareIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmCat(cat)} className="text-red-400 hover:bg-red-500/10">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirmCat}
        onClose={() => setDeleteConfirmCat(null)}
        onConfirm={handleDeleteClick}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteConfirmCat?.name}"? Toàn bộ vật tư thuộc danh mục này sẽ bị chuyển về trạng thái "Chưa phân loại".`}
        confirmText="Xóa danh mục"
        variant="danger"
      />
    </>
  );
};

export default CategoryManageModal;
