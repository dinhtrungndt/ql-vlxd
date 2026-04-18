import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChartBarIcon,
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import { getDashboardReportAction } from '../../stores/redux/actions/reportActions';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, icon, subValue, subLabel, trend = 'up' }) => (
  <Card className="flex flex-col">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className="rounded-lg bg-slate-800/80 p-3 text-blue-500">{icon}</div>
    </div>
    {subValue !== undefined && (
      <div className="mt-4 flex items-center text-sm">
        <span
          className={`font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {subValue}
        </span>
        <span className="ml-2 text-slate-500">{subLabel}</span>
      </div>
    )}
  </Card>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(getDashboardReportAction());
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

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
        <p className="text-slate-400">Báo cáo hoạt động kho trong 30 ngày qua</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng giá trị tồn kho"
          value={formatCurrency(inventory.totalValue)}
          icon={<BanknotesIcon className="h-6 w-6" />}
          subValue={formatNumber(inventory.totalProducts)}
          subLabel="Mã vật tư lưu kho"
        />
        <StatCard
          title="Lượt nhập (30 ngày)"
          value={formatNumber(transactions_30_days.totalImports)}
          icon={<ArchiveBoxIcon className="h-6 w-6" />}
          subValue="Giao dịch"
          subLabel="Đã thực hiện"
        />
        <StatCard
          title="Lượt xuất (30 ngày)"
          value={formatNumber(transactions_30_days.totalExports)}
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          subValue="Giao dịch"
          subLabel="Đã thực hiện"
          trend="down"
        />
        <StatCard
          title="Chi phí (30 ngày)"
          value={formatCurrency(expenses_30_days)}
          icon={<ChartBarIcon className="h-6 w-6" />}
          subValue="Phát sinh"
          subLabel="Trong tháng"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Giá trị tồn kho theo danh mục">
          <div className="flex h-80 items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500">Chưa có dữ liệu</p>
            )}
          </div>
        </Card>

        <Card title="Top 5 vật tư xuất nhiều nhất (30 ngày)">
          <div className="h-80">
            {topExportedProducts && topExportedProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topExportedProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  />
                  <Bar dataKey="totalExported" name="Số lượng xuất" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
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
    </MainLayout>
  );
};

export default DashboardPage;
