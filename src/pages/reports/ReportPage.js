import {
  ArchiveBoxXMarkIcon, BanknotesIcon, CubeIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { getInventoryReportAction } from '../../stores/redux/actions/reportActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const StatCard = ({ title, value, icon, colorClass }) => (
  <Card className="flex flex-col">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`rounded-lg p-3 ${colorClass}`}>{icon}</div>
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
      header: 'Mã / Tên Vật Tư',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.name}</p>
          <p className="text-xs text-slate-400">Mã: {row.id.split('-')[0]}</p>
        </div>
      ),
    },
    {
      header: 'Danh Mục',
      accessor: 'category',
      render: (row) => <Badge variant="gray">{row.category}</Badge>,
    },
    {
      header: 'Giá Nhập',
      accessor: 'import_price',
      render: (row) => formatCurrency(row.import_price),
    },
    {
      header: 'Tồn Kho',
      accessor: 'stock',
      render: (row) => {
        let variant = 'green';
        if (row.stock <= 0) variant = 'red';
        else if (row.stock < 100) variant = 'yellow';

        return (
          <Badge variant={variant}>
            {formatNumber(row.stock)} {row.unit}
          </Badge>
        );
      },
    },
    {
      header: 'Tổng Giá Trị',
      accessor: 'value',
      render: (row) => <span className="font-bold text-blue-400">{formatCurrency(row.value)}</span>,
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Báo Cáo Tồn Kho</h1>
          <p className="text-slate-400">Phân tích chi tiết giá trị và tình trạng hàng hóa</p>
        </div>
        <div className="w-full sm:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Tất cả danh mục</option>
            {inventoryReport?.categoryStats && Object.keys(inventoryReport.categoryStats).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng mã vật tư"
          value={formatNumber(inventoryReport?.summary?.totalProducts || 0)}
          icon={<CubeIcon className="h-6 w-6" />}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Tổng giá trị kho"
          value={formatCurrency(inventoryReport?.summary?.totalValue || 0)}
          icon={<BanknotesIcon className="h-6 w-6" />}
          colorClass="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Sắp hết hàng (< 100)"
          value={formatNumber(inventoryReport?.summary?.lowStockCount || 0)}
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          colorClass="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          title="Đã hết hàng"
          value={formatNumber(inventoryReport?.summary?.outOfStockCount || 0)}
          icon={<ArchiveBoxXMarkIcon className="h-6 w-6" />}
          colorClass="bg-red-500/10 text-red-500"
        />
      </div>

      {/* Bảng chi tiết */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Chi tiết vật tư lưu kho</h3>
        <Table
          columns={columns}
          data={inventoryReport?.products || []}
          loading={loading}
          emptyMessage="Không có dữ liệu báo cáo"
        />
      </div>
    </MainLayout>
  );
};

export default ReportPage;
