import {
  ArchiveBoxXMarkIcon, BanknotesIcon, CubeIcon, ExclamationTriangleIcon, FunnelIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { getInventoryReportAction } from '../../stores/redux/actions/reportActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const StatCard = ({ title, value, icon, colorClass, delay = "" }) => (
  <Card className={`relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${delay}`}>
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className={`rounded-xl p-3 shadow-lg ${colorClass} transition-transform duration-300 group-hover:rotate-12`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
       <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full opacity-50 ${colorClass.split(' ')[0].replace('/10', '')}`} style={{ width: '65%' }}></div>
       </div>
    </div>
  </Card>
);

const ReportPage = () => {
  const dispatch = useDispatch();
  const { inventoryReport, loading } = useSelector((state) => state.report);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    dispatch(getInventoryReportAction(categoryFilter));
  }, [dispatch, categoryFilter]);

  const columns = [
    {
      header: 'Vật Tư',
      accessor: 'name',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-white leading-tight">{row.name}</p>
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">ID: {row.id.split('-')[0]}</span>
             <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
             <span className="text-[10px] text-blue-500 font-bold">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Giá Trị Định Danh',
      accessor: 'import_price',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-white font-mono">{formatCurrency(row.import_price)}</span>
          <span className="text-[10px] text-slate-500">Đơn giá nhập</span>
        </div>
      ),
    },
    {
      header: 'Tình Trạng Kho',
      accessor: 'stock',
      render: (row) => {
        let variant = 'green';
        let color = 'bg-emerald-500';
        let textColor = 'text-emerald-500';
        
        if (row.stock <= 0) {
          variant = 'red';
          color = 'bg-red-500';
          textColor = 'text-red-500';
        } else if (row.stock < 100) {
          variant = 'yellow';
          color = 'bg-yellow-500';
          textColor = 'text-yellow-500';
        }

        return (
          <div className="flex flex-col gap-2 min-w-[120px]">
            <div className="flex items-center justify-between">
               <span className={`text-xs font-black ${textColor}`}>{formatNumber(row.stock)} <span className="text-[10px] text-slate-600 font-bold uppercase">{row.unit}</span></span>
               <Badge variant={variant} className="text-[8px] px-1.5 py-0 uppercase font-black tracking-tighter shadow-sm">
                 {row.stock <= 0 ? 'Hết hàng' : row.stock < 100 ? 'Sắp hết' : 'Ổn định'}
               </Badge>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${color} shadow-[0_0_8px] ${color.replace('bg-', 'shadow-')}`} 
                 style={{ width: `${Math.min((row.stock / 500) * 100, 100)}%` }}
               ></div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Tổng Giá Trị',
      accessor: 'value',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span className="text-lg font-black text-blue-400 font-mono tracking-tighter">{formatCurrency(row.value)}</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase">Ước tính vốn</span>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
             Báo Cáo Tồn Kho
          </h1>
          <p className="mt-1 text-slate-400">Phân tích chuyên sâu về trị giá và biến động hàng hóa trong kho</p>
        </div>
        
        <Card className="p-1 px-2 border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
              <FunnelIcon className="h-4 w-4" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="min-w-[180px] border-none bg-transparent py-2 text-sm text-white focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="" className="bg-slate-900">Tất cả danh mục</option>
              {inventoryReport?.categoryStats && Object.keys(inventoryReport.categoryStats).map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
        </Card>
      </div>

      {/* Thống kê tổng quan */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng danh mục mã"
          value={formatNumber(inventoryReport?.summary?.totalProducts || 0)}
          icon={<CubeIcon className="h-8 w-8 transition-transform group-hover:scale-110" />}
          colorClass="bg-blue-600/10 text-blue-500 border border-blue-500/10"
        />
        <StatCard
          title="Trị giá kho hiện thời"
          value={formatCurrency(inventoryReport?.summary?.totalValue || 0)}
          icon={<BanknotesIcon className="h-8 w-8 transition-transform group-hover:scale-110" />}
          colorClass="bg-emerald-600/10 text-emerald-500 border border-emerald-500/10"
        />
        <StatCard
          title="Vật tư sắp hết"
          value={formatNumber(inventoryReport?.summary?.lowStockCount || 0)}
          icon={<ExclamationTriangleIcon className="h-8 w-8 transition-transform group-hover:scale-110" />}
          colorClass="bg-amber-600/10 text-amber-500 border border-amber-500/10"
        />
        <StatCard
          title="Vật tư đã cháy hàng"
          value={formatNumber(inventoryReport?.summary?.outOfStockCount || 0)}
          icon={<ArchiveBoxXMarkIcon className="h-8 w-8 transition-transform group-hover:scale-110" />}
          colorClass="bg-red-600/10 text-red-500 border border-red-500/10"
        />
      </div>

      {/* Bảng chi tiết */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
            Phân tích chi tiết vật tư lưu kho
          </h3>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-slate-800 to-transparent"></div>
          <Badge variant="blue" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3">
             {inventoryReport?.products?.length || 0} Kết quả
          </Badge>
        </div>
        
        <Table
          columns={columns}
          data={inventoryReport?.products || []}
          loading={loading}
          emptyMessage="Không tìm thấy dữ liệu phù hợp với bộ lọc"
          className="border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl"
        />
      </div>
    </MainLayout>
  );
};

export default ReportPage;
