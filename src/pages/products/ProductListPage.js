import {
  ArchiveBoxIcon, ArrowUturnLeftIcon, BanknotesIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassIcon,
  PencilSquareIcon, PlusIcon, ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
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

  // Tính toán thống kê nhanh
  const stats = {
    total: products?.length || 0,
    lowStock: products?.filter(p => p.stock < 50).length || 0,
    totalValue: products?.reduce((acc, p) => acc + (p.stock * p.import_price), 0) || 0,
  };

  const columns = [
    {
      header: 'Vật Tư',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {row.image ? (
              <img src={row.image} alt={row.name} className="h-10 w-10 rounded-lg object-cover ring-2 ring-slate-800" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                <ArchiveBoxIcon className="h-5 w-5 text-slate-500" />
              </div>
            )}
            {row.stock < 50 && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-slate-900 animate-pulse"></div>
            )}
          </div>
          <div>
            <div className="font-bold text-white leading-none mb-1">{row.name}</div>
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
              {row.id.split('-')[0]} • {row.category}
            </div>
          </div>
        </div>
      ),
    },
    { 
      header: 'Đơn Vị', 
      accessor: 'unit',
      render: (row) => <span className="text-slate-400 font-medium">{row.unit}</span>
    },
    {
      header: 'Giá Nhập',
      accessor: 'import_price',
      render: (row) => <span className="text-white font-mono">{formatCurrency(row.import_price)}</span>,
    },
    {
      header: 'Tồn Kho',
      accessor: 'stock',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black ${row.stock <= 0 ? 'text-red-500' : row.stock < 100 ? 'text-yellow-500' : 'text-emerald-500'}`}>
              {formatNumber(row.stock)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase">{row.unit}</span>
          </div>
          <div className="h-1 w-16 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${row.stock <= 0 ? 'bg-red-500' : row.stock < 100 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((row.stock / 500) * 100, 100)}%` }}
            ></div>
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
          {!showHidden ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => openDetailModal(row.id)} className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                <EyeIcon className="h-4 w-4" />
              </Button>

              {canEdit && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => openEditForm(row)} className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                    <PencilSquareIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setHideConfirmId(row.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <EyeSlashIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </>
          ) : (
            canEdit && (
              <Button size="sm" variant="success" onClick={() => setRestoreConfirmId(row.id)} className="text-emerald-400">
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
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {showHidden ? 'Kho Lưu Trữ Vật Tư' : 'Danh Mục Vật Tư'}
          </h1>
          <p className="mt-1 text-slate-400">
            {showHidden ? 'Vật tư đã ẩn khỏi hệ thống' : 'Quản lý toàn bộ danh mục sản phẩm Kho DVN'}
          </p>
        </div>

        <div className="flex gap-3">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => {
                setShowHidden(!showHidden);
                setSearchTerm('');
              }}
              className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              icon={showHidden ? null : <ArchiveBoxIcon className="h-4 w-4" />}
            >
              {showHidden ? 'Quay lại danh sách' : 'Kho Lưu Trữ'}
            </Button>
          )}

          {!showHidden && canEdit && (
            <Button 
              variant="primary" 
              icon={<PlusIcon className="h-4 w-4" />} 
              onClick={openCreateForm}
              className="shadow-lg shadow-blue-600/20"
            >
              Thêm Vật Tư Mới
            </Button>
          )}
        </div>
      </div>

      {!showHidden && (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="bg-blue-600/5 border-blue-500/10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Danh mục chính</p>
                <h4 className="text-2xl font-black text-white">{stats.total} <span className="text-xs font-medium text-slate-500 uppercase">Sản phẩm</span></h4>
              </div>
            </div>
          </Card>
          <Card className="bg-amber-600/5 border-amber-500/10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cảnh báo tồn kho</p>
                <h4 className="text-2xl font-black text-white">{stats.lowStock} <span className="text-xs font-medium text-slate-500 uppercase">Sắp hết</span></h4>
              </div>
            </div>
          </Card>
          <Card className="bg-emerald-600/5 border-emerald-500/10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                <BanknotesIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá trị ước tính</p>
                <h4 className="text-xl font-black text-white">{formatCurrency(stats.totalValue)}</h4>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card className="mb-6 border-slate-800/50 bg-slate-900/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md items-center gap-3">
            <div className="relative flex-1 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
              <input
                placeholder="Tìm kiếm nhanh tên vật tư..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <Button type="submit" variant="secondary" className="px-6 py-2 rounded-xl">
              Tìm kiếm
            </Button>
          </form>
          <div className="text-right text-xs text-slate-500 italic">
            Hiển thị {currentData?.length || 0} kết quả trong hệ thống
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        data={currentData}
        loading={loading}
        emptyMessage={showHidden ? "Không có vật tư nào trong kho lưu trữ" : "Không tìm thấy vật tư nào"}
        className="border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl"
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
