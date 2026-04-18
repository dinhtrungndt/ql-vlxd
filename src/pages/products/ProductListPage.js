import {
  ArchiveBoxIcon, ArrowUturnLeftIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassIcon,
  PencilSquareIcon, PlusIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import ProductDetailModal from './ProductDetailModal';
import ProductFormModal from './ProductFormModal';

import { useAuth } from '../../hooks/useAuth';
import {
  getHiddenProductsAction, getProductsAction,
  hideProductAction, restoreProductAction
} from '../../stores/redux/actions/productActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { products, hiddenProducts, loading } = useSelector((state) => state.product);
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const [hideConfirmId, setHideConfirmId] = useState(null);
  const [restoreConfirmId, setRestoreConfirmId] = useState(null);

  useEffect(() => {
    if (showHidden) {
      dispatch(getHiddenProductsAction());
    } else {
      dispatch(getProductsAction());
    }
  }, [dispatch, showHidden]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!showHidden) {
      dispatch(getProductsAction({ search: searchTerm }));
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openDetailModal = (id) => {
    setDetailId(id);
    setIsDetailOpen(true);
  };

  const handleHideProduct = async () => {
    if (hideConfirmId) {
      await dispatch(hideProductAction(hideConfirmId));
      setHideConfirmId(null);
    }
  };

  const handleRestoreProduct = async () => {
    if (restoreConfirmId) {
      await dispatch(restoreProductAction(restoreConfirmId));
      setRestoreConfirmId(null);
    }
  };

  // Xác định dữ liệu đang hiển thị dựa vào Tab
  const currentData = showHidden ? hiddenProducts : products;

  const columns = [
    {
      header: 'Tên Vật Tư',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt={row.name} className="h-10 w-10 rounded-md object-cover border border-slate-700" />
          ) : (
            <div className="h-10 w-10 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs text-slate-500">No img</span>
            </div>
          )}
          <div>
            <div className="font-semibold text-white">{row.name}</div>
            <div className="text-xs text-slate-400">{row.sub_category ? `${row.category} / ${row.sub_category}` : row.category}</div>
          </div>
        </div>
      ),
    },
    { header: 'Đơn Vị', accessor: 'unit' },
    {
      header: 'Giá Nhập',
      accessor: 'import_price',
      render: (row) => formatCurrency(row.import_price),
    },
    {
      header: 'Tồn Kho',
      accessor: 'stock',
      render: (row) => (
        <Badge variant={row.stock <= 0 ? 'red' : row.stock < 100 ? 'yellow' : 'green'}>
          {formatNumber(row.stock)} {row.unit}
        </Badge>
      ),
    },
    {
      header: 'Hành Động',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {!showHidden ? (
            <>
              {/* Nút Xem Chi Tiết (Ai cũng xem được) */}
              <Button size="sm" variant="ghost" onClick={() => openDetailModal(row.id)} className="text-blue-400 hover:bg-blue-500/20">
                <EyeIcon className="h-4 w-4 mr-1" /> Xem
              </Button>

              {/* Nút Sửa/Xóa (Chỉ Admin/Manager) */}
              {canEdit && (
                <>
                  <Button size="sm" variant="outline" onClick={() => openEditForm(row)} className="px-2">
                    <PencilSquareIcon className="h-4 w-4" title="Sửa" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setHideConfirmId(row.id)} className="px-2">
                    <EyeSlashIcon className="h-4 w-4" title="Ẩn" />
                  </Button>
                </>
              )}
            </>
          ) : (
            canEdit && (
              <Button size="sm" variant="success" onClick={() => setRestoreConfirmId(row.id)} className="px-2 text-emerald-400 hover:bg-emerald-500/20">
                <ArrowUturnLeftIcon className="h-4 w-4 mr-1" /> Khôi phục
              </Button>
            )
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
            {showHidden ? 'Kho Lưu Trữ Vật Tư' : 'Danh Mục Vật Tư'}
          </h1>
          <p className="text-slate-400">
            {showHidden ? 'Danh sách các vật tư đã bị ẩn khỏi hệ thống' : 'Quản lý danh sách hàng hóa đang hoạt động trong kho'}
          </p>
        </div>

        {/* Nhóm Nút điều khiển */}
        <div className="flex gap-3">
          {canEdit && (
            <Button
              variant={showHidden ? 'primary' : 'outline'}
              onClick={() => {
                setShowHidden(!showHidden);
                setSearchTerm('');
              }}
              icon={showHidden ? null : <ArchiveBoxIcon />}
            >
              {showHidden ? 'Quay lại danh sách chính' : 'Xem Vật tư đã ẩn'}
            </Button>
          )}

          {!showHidden && canEdit && (
            <Button icon={<PlusIcon />} onClick={openCreateForm}>
              Thêm Mới
            </Button>
          )}
        </div>
      </div>

      {!showHidden && (
        <div className="mb-6 rounded-lg bg-slate-900/50 p-4 border border-slate-800 shadow-sm">
          <form onSubmit={handleSearch} className="flex max-w-md items-end gap-3">
            <div className="flex-1">
              <Input
                name="search"
                placeholder="Tìm kiếm vật tư theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0"
              />
            </div>
            <Button type="submit" variant="secondary" icon={<MagnifyingGlassIcon />}>
              Tìm
            </Button>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={currentData}
        loading={loading}
        emptyMessage={showHidden ? "Không có vật tư nào trong kho lưu trữ" : "Không tìm thấy vật tư nào"}
      />

      {/* Các Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
      />

      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        productId={detailId}
      />

      <ConfirmDialog
        isOpen={!!hideConfirmId}
        onClose={() => setHideConfirmId(null)}
        onConfirm={handleHideProduct}
        title="Ẩn vật tư"
        message="Bạn có chắc chắn muốn ẩn vật tư này? Vật tư sẽ được chuyển vào Kho lưu trữ."
        confirmText="Ẩn ngay"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!restoreConfirmId}
        onClose={() => setRestoreConfirmId(null)}
        onConfirm={handleRestoreProduct}
        title="Khôi phục vật tư"
        message="Vật tư này sẽ được khôi phục và hiển thị trở lại trong danh sách chính. Bạn có chắc chắn?"
        confirmText="Khôi phục"
        variant="success"
      />
    </MainLayout>
  );
};

export default ProductListPage;
