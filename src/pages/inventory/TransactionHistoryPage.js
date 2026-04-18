import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import MainLayout from '../../components/layout/MainLayout';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

import { getTransactionsAction } from '../../stores/redux/actions/inventoryActions';
import { getProductsAction } from '../../stores/redux/actions/productActions';
import { formatNumber } from '../../utils/formatters';
import { getTransactionTypeName, getTransactionTypeClass, getReasonName } from '../../utils/helpers';

const TransactionHistoryPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.inventory);
  const { products } = useSelector((state) => state.product);

  const [filterProduct, setFilterProduct] = useState('');

  useEffect(() => {
    dispatch(getProductsAction());
    dispatch(getTransactionsAction());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const pId = e.target.value;
    setFilterProduct(pId);
    dispatch(getTransactionsAction(pId));
  };

  const getProductName = (id) => {
    const p = products.find((x) => x.id === id);
    return p ? p.name : 'Unknown';
  };

  const getProductUnit = (id) => {
    const p = products.find((x) => x.id === id);
    return p ? p.unit : '';
  };

  const columns = [
    {
      header: 'Thời Gian',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-slate-300">
          {format(new Date(row.created_at), 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
    {
      header: 'Vật Tư',
      accessor: 'product_id',
      render: (row) => <span className="font-medium text-white">{getProductName(row.product_id)}</span>,
    },
    {
      header: 'Loại GD',
      accessor: 'type',
      render: (row) => (
        <Badge variant={row.type === 'import' ? 'green' : 'red'}>
          {getTransactionTypeName(row.type)}
        </Badge>
      ),
    },
    {
      header: 'Số Lượng',
      accessor: 'quantity',
      render: (row) => (
        <span className={`font-bold ${getTransactionTypeClass(row.type)}`}>
          {row.type === 'import' ? '+' : '-'}{formatNumber(row.quantity)} {getProductUnit(row.product_id)}
        </span>
      ),
    },
    {
      header: 'Tồn Kho Cuối',
      accessor: 'new_stock',
      render: (row) => <span className="text-slate-300">{formatNumber(row.new_stock)}</span>,
    },
    {
      header: 'Lý Do',
      accessor: 'reason',
      render: (row) => <span className="text-slate-400 text-sm">{getReasonName(row.reason)}</span>,
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lịch Sử Giao Dịch</h1>
          <p className="text-slate-400">Xem lại các lệnh nhập xuất, điều chỉnh kho</p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={filterProduct}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Tất cả vật tư</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={transactions}
        loading={loading}
        emptyMessage="Chưa có lịch sử giao dịch nào"
      />
    </MainLayout>
  );
};

export default TransactionHistoryPage;
