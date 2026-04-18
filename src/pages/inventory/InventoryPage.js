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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Quản Lý Xuất / Nhập Kho</h1>
        <p className="text-slate-400">Thực hiện các giao dịch biến động số lượng vật tư</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card className="h-full">
            <div className="mb-6 flex border-b border-slate-800">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center border-b-2 px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                    ? tab.id === 'import' ? 'border-emerald-500 text-emerald-400'
                      : tab.id === 'export' ? 'border-red-500 text-red-400'
                        : 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  {tab.icon}
                  {tab.name}
                </Button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-2 space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Chọn Vật Tư *
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Vui lòng chọn --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn hiện tại: {formatNumber(p.stock)} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label={activeTab === 'adjust' ? 'Tồn kho thực tế mới *' : 'Số lượng *'}
                  name="quantity"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  helperText={
                    selectedProduct
                      ? `Đơn vị tính: ${selectedProduct.unit}`
                      : ''
                  }
                />

                {activeTab === 'export' && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">
                      Mục đích xuất *
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="usage">Xuất thi công / Sử dụng</option>
                      <option value="damage">Hư hỏng / Hủy hàng</option>
                      <option value="export">Khác</option>
                    </select>
                  </div>
                )}

                {activeTab === 'adjust' && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">
                      Lý do điều chỉnh *
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="adjustment">Kiểm kê định kỳ</option>
                      <option value="damage">Hàng hỏng / Mất mát</option>
                      <option value="purchase">Bổ sung hóa đơn thiếu</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={4}
                  placeholder="Ghi chú thêm về giao dịch này..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={inventoryLoading || !formData.productId}
                  variant={
                    activeTab === 'import' ? 'success'
                      : activeTab === 'export' ? 'danger'
                        : 'primary'
                  }
                  className="px-8"
                >
                  {inventoryLoading ? 'Đang xử lý...' : 'Xác Nhận'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full bg-slate-800/30" title="Hướng dẫn">
            <div className="text-sm text-slate-300 space-y-4">
              <p>
                <strong className="text-emerald-400">Nhập kho:</strong> Khi hàng hóa mới được vận chuyển đến kho hoặc mua thêm. Nó sẽ <b>cộng thêm</b> vào số lượng tồn thực tế.
              </p>
              <hr className="border-slate-700" />
              <p>
                <strong className="text-red-400">Xuất kho:</strong> Khi mang vật tư đi thi công nhà máy, hoặc báo hỏng. Nó sẽ <b>trừ đi</b> vào số lượng tồn thực tế.
              </p>
              <hr className="border-slate-700" />
              <p>
                <strong className="text-blue-400">Kiểm kê:</strong> Dành cho Quản lý. Khi kiểm tra kho thấy lệch số cuối tháng, điền số lượng kho <b>thực tế đếm được</b>. Hệ thống tự động tính toán bù trừ.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
