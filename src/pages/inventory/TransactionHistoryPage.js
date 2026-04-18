import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';

import { useAuth } from '../../hooks/useAuth';
import { getTransactionsAction } from '../../stores/redux/actions/inventoryActions';
import { getProductsAction } from '../../stores/redux/actions/productActions';
import { formatNumber } from '../../utils/formatters';
import { getReasonName, getTransactionTypeClass, getTransactionTypeName } from '../../utils/helpers';

const TransactionHistoryPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { transactions, loading } = useSelector((state) => state.inventory);
  const { products } = useSelector((state) => state.product);

  const [filterProduct, setFilterProduct] = useState('');

  const [printData, setPrintData] = useState(null);

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

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;

    const headers = ['Thời Gian', 'Mã Vật Tư', 'Tên Vật Tư', 'Loại GD', 'Số Lượng', 'Đơn Vị', 'Tồn Cuối', 'Lý Do'];

    const csvData = transactions.map(row => {
      const productName = getProductName(row.product_id);
      const unit = getProductUnit(row.product_id);
      const type = getTransactionTypeName(row.type);
      const reason = getReasonName(row.reason);
      const date = format(new Date(row.created_at), 'dd/MM/yyyy HH:mm:ss');

      return [
        date,
        row.product_id.split('-')[0],
        productName,
        type,
        row.type === 'import' ? `+${row.quantity}` : `-${row.quantity}`,
        unit,
        row.new_stock,
        reason
      ].map(item => `"${String(item).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lich_Su_Kho_${format(new Date(), 'ddMMyyyy_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const content = document.getElementById("print-receipt-section").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow.document.write(`
      <html>
        <head>
          <title>In Phiếu Giao Dịch Kho</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 15mm; size: A5 landscape; }
            }
            body { font-family: 'Times New Roman', serif; padding: 20px; color: #000; background: #fff; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
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
      header: 'Tồn Cuối',
      accessor: 'new_stock',
      render: (row) => <span className="text-slate-300">{formatNumber(row.new_stock)}</span>,
    },
    {
      header: 'Lý Do',
      accessor: 'reason',
      render: (row) => <span className="text-slate-400 text-sm">{getReasonName(row.reason)}</span>,
    },
    {
      header: '',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPrintData(row)}
          className="text-slate-300 hover:text-white"
          title="In Phiếu"
        >
          <PrinterIcon className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lịch Sử Giao Dịch</h1>
          <p className="text-slate-400">Xem lại các lệnh nhập xuất, điều chỉnh kho</p>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
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

          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon />}
            onClick={handleExportCSV}
            disabled={!transactions || transactions.length === 0}
          >
            Xuất CSV
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={transactions}
        loading={loading}
        emptyMessage="Chưa có lịch sử giao dịch nào"
      />

      <Modal
        isOpen={!!printData}
        onClose={() => setPrintData(null)}
        title="Xem trước Phiếu In"
        maxWidth="max-w-3xl"
      >
        {printData && (
          <div className="space-y-6">
            <div id="print-receipt-section" className="bg-white p-8 text-black rounded shadow">
              <div className="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold uppercase">Công ty TNHH VLXD DVN</h2>
                  <p className="text-sm">Địa chỉ: Kho Tổng DVN</p>
                  <p className="text-sm">Hotline: 0909.XXX.XXX</p>
                </div>
                <div className="text-right">
                  <p className="text-sm italic">Mã phiếu: {printData.id.split('-')[0].toUpperCase()}</p>
                  <p className="text-sm italic">
                    Ngày in: {format(new Date(), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>

              {/* Tên Phiếu */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold uppercase">
                  PHIẾU {printData.type === 'import' ? 'NHẬP' : printData.type === 'export' ? 'XUẤT' : 'ĐIỀU CHỈNH'} KHO
                </h1>
                <p className="text-sm italic mt-1">
                  Ngày giao dịch: {format(new Date(printData.created_at), 'dd/MM/yyyy')}
                </p>
              </div>

              {/* Bảng thông tin */}
              <table className="w-full mb-8 border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 text-center w-12">STT</th>
                    <th className="border border-black p-2 text-left">Tên vật tư / Hàng hóa</th>
                    <th className="border border-black p-2 text-center w-24">Đơn vị</th>
                    <th className="border border-black p-2 text-center w-32">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-center">1</td>
                    <td className="border border-black p-2 text-left font-medium">
                      {getProductName(printData.product_id)}
                    </td>
                    <td className="border border-black p-2 text-center">
                      {getProductUnit(printData.product_id)}
                    </td>
                    <td className="border border-black p-2 text-center font-bold">
                      {formatNumber(printData.quantity)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Thông tin bổ sung */}
              <div className="mb-8 text-sm">
                <p><span className="font-semibold">Lý do:</span> {getReasonName(printData.reason)}</p>
                <p><span className="font-semibold">Ghi chú kèm theo:</span> {printData.notes || 'Không có'}</p>
              </div>

              {/* Chữ ký */}
              <div className="flex justify-between text-center pt-8 text-sm pb-16">
                <div>
                  <p className="font-bold">Người giao/nhận</p>
                  <p className="italic text-gray-600 mt-1">(Ký, ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="font-bold">Thủ kho</p>
                  <p className="italic text-gray-600 mt-1">(Ký, ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="font-bold">Người lập phiếu</p>
                  <p className="italic text-gray-600 mt-1">(Ký, ghi rõ họ tên)</p>
                  <p className="mt-16 font-medium">{user?.name || 'Hệ thống'}</p>
                </div>
              </div>
            </div>

            {/* Nút điều khiển bên ngoài vùng in */}
            <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
              <Button variant="ghost" onClick={() => setPrintData(null)}>
                Đóng
              </Button>
              <Button variant="primary" icon={<PrinterIcon />} onClick={handlePrint}>
                In Phiếu Ngay
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default TransactionHistoryPage;
