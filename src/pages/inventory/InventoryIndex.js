import { ArrowsRightLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const InventoryIndexPage = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Quản Lý Kho</h1>
        <p className="mt-1 text-slate-400">Hệ thống điều phối vật tư thông minh DVN</p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Nút Thực hiện giao dịch */}
        <Link
          to="/inventory/manage"
          className="group relative block rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-600/5 transition-all duration-500 group-hover:scale-150"></div>
          
          <div className="relative mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4 text-blue-500 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ArrowsRightLeftIcon className="h-8 w-8" />
          </div>
          
          <h3 className="relative mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
            Thực hiện Giao dịch
          </h3>
          <p className="relative text-base leading-relaxed text-slate-400">
            Hỗ trợ nhập kho vật tư mới, xuất kho thi công dự án, hoặc kiểm kê và điều chỉnh số liệu thực tế một cách chính xác.
          </p>
          
          <div className="mt-6 flex items-center text-sm font-semibold text-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Bắt đầu ngay
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </Link>

        {/* Nút Xem lịch sử */}
        <Link
          to="/inventory/history"
          className="group relative block rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-600/5 transition-all duration-500 group-hover:scale-150"></div>

          <div className="relative mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4 text-emerald-500 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <ClockIcon className="h-8 w-8" />
          </div>
          
          <h3 className="relative mb-3 text-xl font-bold text-white transition-colors group-hover:text-emerald-400">
            Lịch sử Giao dịch
          </h3>
          <p className="relative text-base leading-relaxed text-slate-400">
            Theo dõi dòng luân chuyển vật tư theo thời gian thực. Kiểm tra chi tiết lịch sử nhập, xuất và lý do biến động.
          </p>

          <div className="mt-6 flex items-center text-sm font-semibold text-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Xem chi tiết
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </Link>
      </div>
    </MainLayout>
  );
};

export default InventoryIndexPage;
