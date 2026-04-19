import { ArrowPathIcon, ClockIcon, CubeIcon, InformationCircleIcon, UserIcon } from '@heroicons/react/24/outline';
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
      title="Thông Tin Chi Tiết Vật Tư"
      maxWidth="max-w-4xl"
    >
      {loading || !productDetail ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg shadow-blue-500/20"></div>
            <p className="text-sm font-medium text-slate-500 animate-pulse uppercase tracking-widest">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left partition: Product Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-0 space-y-6">
              <div className="group relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 p-6 shadow-2xl transition-all hover:bg-slate-800/80">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {productDetail.image ? (
                        <img src={productDetail.image} alt={productDetail.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-700">
                          <CubeIcon className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                       <Badge variant={productDetail.is_active ? 'green' : 'red'} className="shadow-lg">
                          {productDetail.is_active ? 'Hoạt động' : 'Đã ẩn'}
                       </Badge>
                    </div>
                  </div>

                  <h3 className="text-center text-2xl font-black text-white leading-tight mb-2">{productDetail.name}</h3>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
                    Mã quản lý: {productDetail.id?.split('-')[0].toUpperCase()}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <Badge variant="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{productDetail.category}</Badge>
                    {productDetail.sub_category && (
                      <Badge variant="gray" className="bg-slate-800 text-slate-400 border-slate-700">{productDetail.sub_category}</Badge>
                    )}
                  </div>

                  <div className="w-full space-y-3 rounded-2xl bg-slate-900/50 p-5 border border-slate-800/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Giá nhập niêm yết</span>
                      <span className="text-lg font-black text-white font-mono tracking-tight">{formatCurrency(productDetail.import_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Lượng tồn hiện hữu</span>
                      <div className="flex items-center gap-2">
                         <span className={`text-lg font-black ${productDetail.stock <= 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                           {formatNumber(productDetail.stock)}
                         </span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">{productDetail.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {productDetail.description && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
                  <h5 className="mb-3 flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <InformationCircleIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Đặc tính kĩ thuật / Mô tả
                  </h5>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {productDetail.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right partition: Change Logs Timeline */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h4 className="flex items-center text-xl font-bold text-white">
                <ClockIcon className="mr-3 h-6 w-6 text-blue-500" />
                Lịch sử biến động
              </h4>
              <Badge variant="blue" className="bg-blue-600/5 text-blue-500 border-blue-500/10">
                {productDetail.history?.length || 0} lần cập nhật
              </Badge>
            </div>

            {productDetail.history && productDetail.history.length > 0 ? (
              <div className="relative space-y-8 pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:via-slate-800 before:to-transparent">
                {productDetail.history.map((hist, index) => {
                  const oldData = parsePreviousData(hist.previous_data);
                  return (
                    <div key={hist.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-7.5 top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-blue-500 shadow-[0_0_10px_#3b82f6] group-hover:scale-125 transition-transform duration-300"></div>
                      
                      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg group-hover:bg-slate-800/60 transition-colors border-l-4 border-l-blue-500/50">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                               <ArrowPathIcon className="h-4 w-4" />
                             </div>
                             <div>
                                <p className="text-xs font-black text-white">Cập nhật dữ liệu</p>
                                <p className="text-[10px] text-slate-500 italic">
                                  {format(new Date(hist.updated_at), 'dd/MM/yyyy HH:mm:ss')}
                                </p>
                             </div>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/50 px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-800">
                             <UserIcon className="h-3 w-3" />
                             {hist.updated_by_id?.split('-')[0].toUpperCase()}
                          </div>
                        </div>

                        {oldData ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             {oldData.name !== productDetail.name && (
                               <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50">
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Tên cũ</p>
                                 <p className="text-sm text-slate-400 italic line-through">{oldData.name}</p>
                               </div>
                             )}
                             {oldData.import_price !== productDetail.import_price && (
                               <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50">
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Giá cũ</p>
                                 <p className="text-sm text-red-400/80 font-mono tracking-tighter line-through">{formatCurrency(oldData.import_price)}</p>
                               </div>
                             )}
                             <p className="md:col-span-2 text-[10px] text-slate-500 italic">
                               Hệ thống đã tự động ghi nhận các thay đổi so với phiên bản trước đó.
                             </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Không tìm thấy dữ liệu đối soát cũ cho bản ghi này.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center">
                <div className="mb-4 rounded-full bg-slate-800/50 p-4 text-slate-600">
                  <ClockIcon className="h-10 w-10" />
                </div>
                <h5 className="text-lg font-bold text-slate-400">Chưa có lịch sử biến động</h5>
                <p className="mt-1 text-sm text-slate-600">Mọi thay đổi về thông tin của vật tư này sau khi khai báo sẽ được hệ thống ghi nhận tại đây.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetailModal;
