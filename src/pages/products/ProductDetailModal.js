import { ClockIcon, CubeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getProductDetailAction } from '../../stores/redux/actions/productActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  const dispatch = useDispatch();
  const { productDetail, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (isOpen && productId) {
      dispatch(getProductDetailAction(productId));
    }
  }, [isOpen, productId, dispatch]);

  const parsePreviousData = (jsonStr) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Vật Tư & Lịch Sử"
      maxWidth="max-w-3xl"
    >
      {loading || !productDetail ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Thông tin chung */}
          <div className="flex items-start gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800">
              {productDetail.image ? (
                <img src={productDetail.image} alt={productDetail.name} className="h-full w-full object-cover" />
              ) : (
                <CubeIcon className="h-10 w-10 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{productDetail.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="blue">{productDetail.category}</Badge>
                {productDetail.sub_category && <Badge variant="gray">{productDetail.sub_category}</Badge>}
                <Badge variant={productDetail.stock > 0 ? 'green' : 'red'}>
                  Tồn: {formatNumber(productDetail.stock)} {productDetail.unit}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-300">
                <p><span className="text-slate-500">Giá nhập:</span> <span className="font-semibold text-white">{formatCurrency(productDetail.import_price)}</span></p>
                <p><span className="text-slate-500">Trạng thái:</span> {productDetail.is_active ? 'Đang hoạt động' : 'Đã ẩn'}</p>
                {productDetail.description && (
                  <p className="col-span-2"><span className="text-slate-500">Mô tả:</span> {productDetail.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Lịch sử cập nhật */}
          <div>
            <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
              <ClockIcon className="mr-2 h-5 w-5 text-blue-400" />
              Lịch sử thay đổi thông tin
            </h4>

            {productDetail.history && productDetail.history.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {productDetail.history.map((hist, index) => {
                  const oldData = parsePreviousData(hist.previous_data);
                  return (
                    <div key={hist.id} className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm">
                      <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="font-medium text-blue-400">
                          {format(new Date(hist.updated_at), 'dd/MM/yyyy HH:mm:ss')}
                        </span>
                        <span className="text-xs text-slate-500">Mã NV: {hist.updated_by_id.split('-')[0]}</span>
                      </div>
                      {oldData && (
                        <div className="grid grid-cols-2 gap-2 text-slate-300">
                          <p><span className="text-slate-500">Tên cũ:</span> {oldData.name}</p>
                          <p><span className="text-slate-500">Giá nhập cũ:</span> <span className="text-red-400 line-through">{formatCurrency(oldData.import_price)}</span></p>
                          <p><span className="text-slate-500">Danh mục cũ:</span> {oldData.category}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-500">
                Vật tư này chưa từng bị chỉnh sửa thông tin.
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetailModal;
