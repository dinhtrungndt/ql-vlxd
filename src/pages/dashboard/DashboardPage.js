import {
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, Cell,
  Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis,
  YAxis
} from 'recharts';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import { getTransactionsAction } from '../../stores/redux/actions/inventoryActions';
import { getProductsAction } from '../../stores/redux/actions/productActions';
import { getDashboardReportAction } from '../../stores/redux/actions/reportActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-sm font-medium text-slate-300">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: item.color || item.fill }}>
            {item.name}: {formatter ? formatter(item.value) : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon, subValue, subLabel, trend = 'up', color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-600/5 transition-all duration-500 group-hover:scale-150"></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</h3>
        </div>
        <div className={`rounded-xl border p-3 transition-colors duration-300 ${colorMap[color]}`}>
          {React.cloneElement(icon, { className: 'h-6 w-6' })}
        </div>
      </div>

      {subValue !== undefined && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
            {trend === 'up' ? '↑' : '↓'} {subValue}
          </div>
          <span className="text-slate-500">{subLabel}</span>
        </div>
      )}
    </Card>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboard, loading } = useSelector((state) => state.report);
  const { transactions } = useSelector((state) => state.inventory);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getDashboardReportAction());
    dispatch(getTransactionsAction());
    dispatch(getProductsAction());
  }, [dispatch]);

  if (loading || !dashboard) {
    return (
      <MainLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  const {
    inventory,
    transactions_30_days,
    expenses_30_days,
    topExportedProducts,
  } = dashboard;

  const pieData = (inventory.byCategory || []).map((c) => ({
    name: c.category,
    value: c.totalValue,
  }));

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleNavigateToInventory = () => {
    navigate('/inventory/manage');
  };

  const handleRefresh = () => {
    dispatch(getDashboardReportAction());
    dispatch(getTransactionsAction());
  };

  // Helper lấy tên vật tư
  const getProductName = (id) => {
    const p = products.find((x) => x.id === id);
    return p ? p.name : 'Vật tư đã xóa';
  };

  const getProductUnit = (id) => {
    const p = products.find((x) => x.id === id);
    return p ? p.unit : '';
  };

  // Lấy 5 giao dịch gần nhất
  const recentTransactions = transactions ? transactions.slice(0, 5) : [];

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tổng quan</h1>
          <p className="mt-1 text-slate-400">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ArrowTrendingUpIcon className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng giá trị tồn kho"
          value={formatCurrency(inventory.totalValue)}
          icon={<BanknotesIcon />}
          subValue={formatNumber(inventory.totalProducts)}
          subLabel="Mã vật tư lưu kho"
          color="blue"
        />
        <StatCard
          title="Lượt nhập (30 ngày)"
          value={formatNumber(transactions_30_days.totalImports)}
          icon={<ArchiveBoxIcon />}
          subValue="24%"
          subLabel="so với tháng trước"
          color="emerald"
        />
        <StatCard
          title="Lượt xuất (30 ngày)"
          value={formatNumber(transactions_30_days.totalExports)}
          icon={<ArrowTrendingUpIcon />}
          subValue="12%"
          subLabel="so với tháng trước"
          trend="down"
          color="amber"
        />
        <StatCard
          title="Chi phí (30 ngày)"
          value={formatCurrency(expenses_30_days)}
          icon={<ChartBarIcon />}
          subValue="8%"
          subLabel="so với dự kiến"
          trend="down"
          color="rose"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Giá trị tồn kho theo danh mục" headerClassName="border-none">
          <div className="flex h-80 items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500">Chưa có dữ liệu</p>
            )}
          </div>
        </Card>

        <Card title="Top 5 vật tư xuất nhiều nhất" headerClassName="border-none">
          <div className="h-80">
            {topExportedProducts && topExportedProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topExportedProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    width={100}
                    tick={{ fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} content={<CustomTooltip />} />
                  <Bar
                    dataKey="totalExported"
                    name="Số lượng xuất"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-slate-500">Chưa có giao dịch xuất kho</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Hoạt động gần đây" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Sản phẩm</th>
                    <th className="px-6 py-4 font-medium">Loại</th>
                    <th className="px-6 py-4 font-medium">Số lượng</th>
                    <th className="px-6 py-4 font-medium">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-medium text-white">{getProductName(row.product_id)}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.type === 'import' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                            {row.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={row.type === 'import' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                            {row.type === 'import' ? '+' : '-'}{formatNumber(row.quantity)} {getProductUnit(row.product_id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(row.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        Chưa có giao dịch nào gần đây
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center border-t border-slate-800">
              <button onClick={() => navigate('/inventory/history')} className="text-sm font-medium text-blue-500 hover:text-blue-400">
                Xem tất cả giao dịch
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Trạng thái kho" className="bg-gradient-to-br from-slate-900/50 to-blue-900/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Dung lượng sử dụng</span>
                <span className="text-sm font-bold text-white">78%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div className="h-full w-[78%] rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
              </div>
              <p className="text-xs text-slate-500 italic">Kho A đang dần đầy, bạn nên xem xét sắp xếp lại không gian.</p>
            </div>
          </Card>

          <Card title="Lối tắt nhanh">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-800" onClick={handleNavigateToInventory}>
                <ArchiveBoxIcon className="h-6 w-6 text-emerald-500" />
                <span className="text-xs font-medium text-white">Nhập kho</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-800" onClick={handleNavigateToInventory}>
                <ArrowTrendingUpIcon className="h-6 w-6 text-amber-500" />
                <span className="text-xs font-medium text-white">Xuất kho</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
