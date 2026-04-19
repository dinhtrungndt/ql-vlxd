import { ArrowDownTrayIcon, ArrowTrendingUpIcon, ClockIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../components/layout/MainLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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
  const [activeStatus, setActiveStatus] = useState('all'); // all, import, export, adjust

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

  const filteredTransactions = transactions?.filter((t) => {
    if (activeStatus === 'all') return true;
    return t.type === activeStatus;
  }) || [];

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

  const stats = transactions ? {
    today: transactions.filter(t => format(new Date(t.created_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length,
    imports: transactions.filter(t => t.type === 'import').length,
    exports: transactions.filter(t => t.type === 'export').length,
  } : { today: 0, imports: 0, exports: 0 };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Lịch Sử Giao Dịch</h1>
          <p className="mt-1 text-slate-400">Tra cứu dòng luân chuyển vật tư DVN</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="h-4 w-4" />}
            onClick={handleExportCSV}
            disabled={!transactions || transactions.length === 0}
            className="border-slate-700 hover:bg-slate-800"
          >
            Xuất file CSV
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { id: 'all', title: 'Tất cả', count: transactions?.length || 0, label: 'GD', icon: <ClockIcon />, color: 'slate' },
          { id: 'import', title: 'Nhập Kho', count: stats.imports, label: 'Phiếu', icon: <ArrowTrendingUpIcon />, color: 'emerald' },
          { id: 'export', title: 'Xuất Kho', count: stats.exports, label: 'Phiếu', icon: <ArrowDownTrayIcon />, color: 'red' },
          { id: 'adjust', title: 'Điều Chỉnh', count: transactions?.filter(t => t.type === 'adjust').length || 0, label: 'Phiếu', icon: <ClockIcon />, color: 'blue' }
        ].map((item) => (
          <Card
            key={item.id}
            onClick={() => setActiveStatus(item.id)}
            className={`group relative cursor-pointer overflow-hidden transition-all duration-300 ${activeStatus === item.id
                ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
          >
            {activeStatus === item.id && (
              <div className="absolute top-0 right-0 p-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 transition-all duration-300 ${activeStatus === item.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500'
                    : item.color === 'red' ? 'bg-red-500/10 text-red-500'
                      : item.color === 'blue' ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-slate-500/10 text-slate-400'
                }`}>
                {React.cloneElement(item.icon, { className: 'h-6 w-6' })}
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeStatus === item.id ? 'text-blue-400' : 'text-slate-500'
                  }`}>
                  {item.title}
                </p>
                <h4 className="flex items-baseline gap-1 text-2xl font-black text-white">
                  {item.count}
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                </h4>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-6 border-slate-800/50 bg-slate-900/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="mb-2 block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Bộ lọc vật tư nâng cao
            </label>
            <div className="relative group max-w-md">
              <select
                value={filterProduct}
                onChange={handleFilterChange}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="">Tất cả vật tư hệ thống</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id.split('-')[0].toUpperCase()})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors">
                ▼
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 italic">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Đang hiển thị {filteredTransactions.length} kết quả phù hợp
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        data={filteredTransactions}
        loading={loading}
        emptyMessage="Chưa có dữ liệu giao dịch trong bộ lọc này"
        className="border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl"
      />

      <Modal
        isOpen={!!printData}
        onClose={() => setPrintData(null)}
        title="Xem trước Phiếu In"
        maxWidth="max-w-4xl"
      >
        {printData && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-2 overflow-hidden">
              <div id="print-receipt-section" className="bg-white p-12 text-black shadow-inner">
                <div className="flex justify-between border-b-[3px] border-black pb-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Công ty TNHH VLXD DVN</h2>
                    <p className="text-sm font-medium text-gray-700">Kho Tổng: 123 Đường VLXD, TP. Hồ Chí Minh</p>
                    <p className="text-sm font-medium text-gray-700">Hotline: 0909.123.456 - Website: dvn.vn</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-2 border-black p-2 mb-2 font-mono text-xs font-bold">
                      MÃ PHIẾU: {printData.id.split('-')[0].toUpperCase()}
                    </div>
                    <p className="text-xs italic text-gray-500">
                      Ngày lập: {format(new Date(), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h1 className="text-4xl font-black uppercase tracking-widest text-black">
                    PHIẾU {printData.type === 'import' ? 'NHẬP' : printData.type === 'export' ? 'XUẤT' : 'ĐIỀU CHỈNH'} KHO
                  </h1>
                  <p className="text-base font-bold italic mt-2 border-y border-black/10 py-1 inline-block px-10">
                    Thời điểm giao dịch: {format(new Date(printData.created_at), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                  <div>
                    <p className="mb-1"><span className="font-bold uppercase inline-block w-32">Nhân viên lập:</span> {user?.name || 'Hệ thống'}</p>
                    <p className="mb-1"><span className="font-bold uppercase inline-block w-32">Đơn vị:</span> Kho vật tư trung tâm</p>
                  </div>
                  <div>
                    <p className="mb-1"><span className="font-bold uppercase inline-block w-32">Hình thức:</span> {getTransactionTypeName(printData.type)}</p>
                    <p className="mb-1"><span className="font-bold uppercase inline-block w-32">Lý do:</span> {getReasonName(printData.reason)}</p>
                  </div>
                </div>

                <table className="w-full mb-10 border-collapse border-[2px] border-black text-sm">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border border-black p-3 text-center uppercase tracking-wider w-12">STT</th>
                      <th className="border border-black p-3 text-left uppercase tracking-wider">Tên vật tư / Hàng hóa chính thức</th>
                      <th className="border border-black p-3 text-center uppercase tracking-wider w-24">Đơn vị</th>
                      <th className="border border-black p-3 text-center uppercase tracking-wider w-32">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-x border-black p-4 text-center">01</td>
                      <td className="border-x border-black p-4 text-left font-black text-base">
                        {getProductName(printData.product_id)}
                        <p className="text-[10px] font-normal italic mt-1 text-gray-500">Mã kĩ thuật: {printData.product_id}</p>
                      </td>
                      <td className="border-x border-black p-4 text-center font-bold">
                        {getProductUnit(printData.product_id)}
                      </td>
                      <td className="border-x border-black p-4 text-center text-xl font-black">
                        {printData.type === 'import' ? '+' : '-'}{formatNumber(printData.quantity)}
                      </td>
                    </tr>
                    {/* Hàng trống để giãn bảng cho chuyên nghiệp */}
                    {[1, 2, 3].map(i => (
                      <tr key={i} className="h-10 border-b border-gray-200">
                        <td className="border-x border-black"></td>
                        <td className="border-x border-black"></td>
                        <td className="border-x border-black"></td>
                        <td className="border-x border-black"></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="3" className="border border-black p-3 text-right uppercase">Tổng cộng vật tư:</td>
                      <td className="border border-black p-3 text-center text-lg">{formatNumber(printData.quantity)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="mb-12 text-sm italic border-l-4 border-black pl-4">
                  <p><span className="font-bold not-italic font-sans">Ghi chú kèm theo:</span> {printData.notes || 'Không có yêu cầu ghi chú đặc biệt cho giao dịch này.'}</p>
                </div>

                <div className="grid grid-cols-3 text-center text-sm mb-20 bg-gray-50/50 py-6 rounded-lg">
                  <div>
                    <h5 className="font-black uppercase mb-1">Người nhận/Giao</h5>
                    <p className="text-[10px] italic text-gray-500 mb-16">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div>
                    <h5 className="font-black uppercase mb-1">Thủ kho</h5>
                    <p className="text-[10px] italic text-gray-500 mb-16">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div>
                    <h5 className="font-black uppercase mb-1">Giám đốc duyệt</h5>
                    <p className="text-[10px] italic text-gray-500 mb-16">(Ký, đóng dấu)</p>
                  </div>
                </div>

                <div className="text-center pt-10 border-t border-black/5 text-[10px] text-gray-400">
                  Phát hành bởi Hệ thống Quản trị DVN - www.dvn.vn - Bản quyền © 2026
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-500 max-w-xs">Hệ thống sẽ tự động tối ưu layout cho khổ giấy A5 hoặc A4 khi bạn nhấn nút "In Phiếu Ngay".</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setPrintData(null)} className="text-slate-400 hover:text-white">
                  Hủy bỏ
                </Button>
                <Button variant="primary" icon={<PrinterIcon className="h-4 w-4" />} onClick={handlePrint} className="px-6 shadow-blue-500/20 shadow-lg">
                  In Phiếu Ngay
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default TransactionHistoryPage;
