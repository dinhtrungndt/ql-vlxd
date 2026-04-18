import { ArrowsRightLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const InventoryIndexPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Danh Mục Quản Lý Kho</h1>
        <p className="text-slate-400">Vui lòng chọn chức năng bạn muốn thực hiện</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Nút Thực hiện giao dịch */}
        <Link
          to="/inventory/manage"
          className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            <ArrowsRightLeftIcon className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Thực hiện Giao dịch</h3>
          <p className="text-sm text-slate-400">
            Thực hiện nhập kho, xuất kho thi công, hoặc kiểm kê và điều chỉnh số lượng tồn kho thực tế.
          </p>
        </Link>

        {/* Nút Xem lịch sử */}
        <Link
          to="/inventory/history"
          className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
            <ClockIcon className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Lịch sử Giao dịch</h3>
          <p className="text-sm text-slate-400">
            Xem lại toàn bộ lịch sử biến động kho, chi tiết các phiếu nhập, phiếu xuất theo thời gian.
          </p>
        </Link>
      </div>
    </MainLayout>
  );
};

export default InventoryIndexPage;
