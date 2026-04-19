import { AdjustmentsHorizontalIcon, ArchiveBoxArrowDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { adjustStockAction, exportStockAction, importStockAction } from '../../stores/redux/actions/inventoryActions';
import { getProductsAction } from '../../stores/redux/actions/productActions';
import { formatNumber } from '../../utils/formatters';

const InventoryPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { loading: inventoryLoading } = useSelector((state) => state.inventory);
  const { isAdmin, isManager } = useAuth();
  const canAdjust = isAdmin || isManager;

  const [activeTab, setActiveTab] = useState('import'); // import | export | adjust
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: 'purchase',
    notes: '',
  });

  useEffect(() => {
    dispatch(getProductsAction());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      productId: '',
      quantity: '',
      reason: tab === 'import' ? 'purchase' : tab === 'export' ? 'usage' : 'adjustment',
      notes: '',
    });
  };

  const selectedProduct = products.find((p) => p.id === formData.productId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity === '') return;

    let payload = {
      productId: formData.productId,
      notes: formData.notes,
    };

    let result;
    if (activeTab === 'adjust') {
      payload.newStock = Number(formData.quantity);
      payload.reason = formData.reason;
      result = await dispatch(adjustStockAction(payload));
    } else if (activeTab === 'export') {
      payload.quantity = Number(formData.quantity);
      payload.reason = formData.reason;
      result = await dispatch(exportStockAction(payload));
    } else {
      payload.quantity = Number(formData.quantity);
      result = await dispatch(importStockAction(payload));
    }

    if (result && result.success) {
      setFormData((prev) => ({ ...prev, quantity: '', notes: '' }));
      dispatch(getProductsAction());
    }
  };

  const tabs = [
    { id: 'import', name: 'Nhập Kho', icon: <ArrowUpTrayIcon className="w-5 h-5 mr-2" /> },
    { id: 'export', name: 'Xuất Kho', icon: <ArchiveBoxArrowDownIcon className="w-5 h-5 mr-2" /> },
    ...(canAdjust ? [{ id: 'adjust', name: 'Kiểm Kê & Điều Chỉnh', icon: <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" /> }] : []),
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Điều Phối Vật Tư</h1>
        <p className="mt-1 text-slate-400">Thực hiện nhập, xuất hoặc điều chỉnh tồn kho vật tư</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card className="overflow-hidden" noPadding>
            <div className="flex border-b border-slate-800 bg-slate-800/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex flex-1 items-center justify-center py-4 text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                    ? tab.id === 'import' ? 'text-emerald-400 font-bold'
                      : tab.id === 'export' ? 'text-red-400 font-bold'
                        : 'text-blue-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                >
                  <div className="flex items-center">
                    {tab.icon}
                    {tab.name}
                  </div>
                  {activeTab === tab.id && (
                    <div className={`absolute bottom-0 left-0 h-0.5 w-full ${activeTab === 'import' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : activeTab === 'export' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                      }`} />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Chọn Vật Tư *
                </label>
                <div className="relative group">
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3.5 text-base text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-slate-800"
                  >
                    <option value="" disabled>-- Chọn vật tư từ danh sách --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - SKU: {p.id.split('-')[0].toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors">
                    ▼
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    label={activeTab === 'adjust' ? 'Tồn thực tế đếm được *' : 'Số lượng giao dịch *'}
                    name="quantity"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="py-3.5 text-lg font-bold"
                    placeholder="0.00"
                  />
                  {selectedProduct && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 px-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Đơn vị tính: {selectedProduct.unit}
                    </div>
                  )}
                </div>

                {activeTab !== 'import' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      Lý do thực hiện *
                    </label>
                    <div className="relative group">
                      <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3.5 text-base text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-slate-800"
                      >
                        {activeTab === 'export' ? (
                          <>
                            <option value="usage">Xuất thi công / Sử dụng</option>
                            <option value="damage">Hư hỏng / Hủy hàng</option>
                            <option value="export">Khác</option>
                          </>
                        ) : (
                          <>
                            <option value="adjustment">Kiểm kê định kỳ</option>
                            <option value="damage">Hàng hỏng / Mất mát</option>
                            <option value="purchase">Bổ sung hóa đơn thiếu</option>
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors">
                        ▼
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Ghi chú chi tiết
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-white placeholder-slate-600 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-slate-800 min-h-[120px]"
                  placeholder="Ghi chú thêm về giao dịch này (số xe, tên người nhận, mã dự án...)"
                ></textarea>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={inventoryLoading || !formData.productId}
                  variant={
                    activeTab === 'import' ? 'success'
                      : activeTab === 'export' ? 'danger'
                        : 'primary'
                  }
                  className="px-12 py-4 text-base font-bold shadow-xl transition-transform hover:scale-105"
                >
                  {inventoryLoading ? 'Đang gửi...' : `Xác Nhận ${activeTab === 'import' ? 'Nhập' : activeTab === 'export' ? 'Xuất' : 'Điều Chỉnh'}`}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {selectedProduct ? (
            <Card className="border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20" title="Vật Tư Đã Chọn">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-slate-800 text-2xl font-bold text-blue-400">
                    {selectedProduct.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">{selectedProduct.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1 uppercase">SKU: {selectedProduct.id.split('-')[0]}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Tồn hiện tại</p>
                    <p className="text-xl font-black text-white">{formatNumber(selectedProduct.stock)} <span className="text-xs font-normal text-slate-400">{selectedProduct.unit}</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Dự kiến sau GD</p>
                    <p className={`text-xl font-black ${activeTab === 'import' ? 'text-emerald-400' :
                      activeTab === 'export' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                      {formatNumber(
                        activeTab === 'adjust' ? Number(formData.quantity || 0) :
                          activeTab === 'import' ? selectedProduct.stock + Number(formData.quantity || 0) :
                            selectedProduct.stock - Number(formData.quantity || 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Hướng dẫn" className="bg-slate-800/30 border-dashed">
              <div className="text-sm text-slate-400 space-y-4 italic">
                Chọn một vật tư từ danh sách bên trái để xem thông tin tồn kho chi tiết và thực hiện giao dịch.
              </div>
            </Card>
          )}

          <Card title="Sổ Tay Nghiệp Vụ" headerClassName="border-none">
            <div className="space-y-5">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 h-full w-0.5 bg-emerald-500"></div>
                <h5 className="text-sm font-bold text-emerald-400">Nhập Kho</h5>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">Dùng khi nhập hàng từ nhà cung cấp hoặc thu hồi vật tư dư thừa. Số lượng sẽ được cộng dồn vào kho.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-1 h-full w-0.5 bg-red-500"></div>
                <h5 className="text-sm font-bold text-red-400">Xuất Kho</h5>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">Dùng khi cấp vật tư cho đội thi công hoặc báo hủy hàng hỏng. Số lượng sẽ bị trừ trực tiếp khỏi kho.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-1 h-full w-0.5 bg-blue-500"></div>
                <h5 className="text-sm font-bold text-blue-400">Kiểm Kê</h5>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">Chỉ dành cho quản lý. Dùng để đồng bộ số liệu trên phần mềm với số lượng vật tư thực tế đếm được tại kho.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
