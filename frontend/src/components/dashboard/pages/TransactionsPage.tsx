import React, { useMemo, useState, useRef } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, MoreVertical, Calendar, X, FileDown, FileImage } from 'lucide-react';
import { useWalletStore } from '@/stores/walletStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const TransactionsPage: React.FC = () => {
  const { transactions } = useWalletStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const filteredTransactions = useMemo(() => {
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;

    return (
      transactions?.filter((tx: any) => {
        const matchesType = filterType === 'all' || tx.type === filterType;
        const matchesSearch = (tx.description || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (start) matchesDate = matchesDate && new Date(tx.createdAt) >= start;
        if (end) {
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && new Date(tx.createdAt) <= endOfDay;
        }

        return matchesType && matchesSearch && matchesDate;
      }) || []
    );
  }, [transactions, filterType, searchTerm, dateRange]);

  const getTransactionIcon = (type: string) => {
    const isIncome = type?.toLowerCase().includes('received') || type?.toLowerCase().includes('deposit');
    return isIncome ? (
      <ArrowDownLeft className="w-5 h-5 text-green-600" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-red-600" />
    );
  };

  const statusStyles = (status?: string) => {
    const s = (status || 'completed').toLowerCase();
    if (s.includes('pending')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
    if (s.includes('fail') || s.includes('declin')) return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  };

  const formatCurrency = (n: number) => `₦${(n || 0).toLocaleString('en-NG')}`;

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((tx: any) => tx.type?.toLowerCase().includes('received') || tx.type?.toLowerCase().includes('deposit'))
      .reduce((a: number, b: any) => a + (b.amount || 0), 0);
    const expense = filteredTransactions
      .filter((tx: any) => !(tx.type?.toLowerCase().includes('received') || tx.type?.toLowerCase().includes('deposit')))
      .reduce((a: number, b: any) => a + (b.amount || 0), 0);
    return { count: filteredTransactions.length, income, expense };
  }, [filteredTransactions]);

  const clearFilters = () => {
    setFilterType('all');
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Status'];
    const csvData = filteredTransactions.map((tx: any) => [
      new Date(tx.createdAt).toLocaleDateString(),
      tx.type,
      tx.description,
      formatCurrency(tx.amount),
      tx.status || 'Completed',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transaction Report', 14, 22);
    
    // Add summary
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Transactions: ${summary.count}`, 14, 36);
    doc.text(`Total Inflow: ${formatCurrency(summary.income)}`, 14, 42);
    doc.text(`Total Outflow: ${formatCurrency(summary.expense)}`, 14, 48);
    
    // Add table
    const tableData = filteredTransactions.map((tx: any) => [
      new Date(tx.createdAt).toLocaleDateString(),
      tx.type,
      tx.description,
      formatCurrency(tx.amount),
      tx.status || 'Completed',
    ]);

    autoTable(doc, {
      head: [['Date', 'Type', 'Description', 'Amount', 'Status']],
      body: tableData,
      startY: 55,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportMenu(false);
  };

  const exportToImage = async () => {
    if (!exportRef.current) return;
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent dark:from-blue-400/10 dark:via-blue-300/5 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
              Search, filter and export your transaction history
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={exportToCSV}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Export as PDF
                </button>
                <button
                  onClick={exportToImage}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  Export as Image
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Inflow</p>
            <p className="mt-1 text-lg font-semibold text-green-600">+{formatCurrency(summary.income)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 hidden md:block">
            <p className="text-xs text-gray-500 dark:text-gray-400">Outflow</p>
            <p className="mt-1 text-lg font-semibold text-red-600">-{formatCurrency(summary.expense)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  aria-label="Clear search"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60 dark:hover:bg-gray-600/60"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Type segmented control */}
          <div className="grid grid-cols-2 sm:inline-flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            {[
              { key: 'all', label: 'All' },
              { key: 'deposit', label: 'Deposit' },
              { key: 'transfer', label: 'Transfer' },
              { key: 'withdrawal', label: 'Withdrawal' },
              { key: 'payment', label: 'Payment' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterType(opt.key)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium transition focus:outline-none border-r last:border-r-0 border-gray-200 dark:border-gray-600 ${
                  filterType === opt.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clear */}
          <div className="flex lg:ml-auto">
            <button onClick={clearFilters} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div ref={exportRef} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr className="text-left text-gray-600 dark:text-gray-200">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 grid place-items-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="font-medium">No transactions match your filters</p>
                      <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx: any, idx: number) => (
                  <tr key={tx.id} className={idx % 2 ? 'bg-gray-50/50 dark:bg-gray-700/30' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(tx.type)}
                        <span className="capitalize text-gray-800 dark:text-gray-100">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{tx.description}</td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={(tx.type || '').toLowerCase().includes('received') || (tx.type || '').toLowerCase().includes('deposit') ? 'text-green-600' : 'text-red-600'}>
                        {((tx.type || '').toLowerCase().includes('received') || (tx.type || '').toLowerCase().includes('deposit') ? '+' : '-')}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles(tx.status)}`}>
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions</div>
          ) : (
            filteredTransactions.map((tx: any) => {
              const income = (tx.type || '').toLowerCase().includes('received') || (tx.type || '').toLowerCase().includes('deposit');
              return (
                <div key={tx.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${income ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                      {income ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString()} • <span className={`font-medium ${statusStyles(tx.status).split(' ')[1]}`}>{tx.status || 'Completed'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${income ? 'text-green-600' : 'text-red-600'}`}>
                      {income ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <button className="mt-2 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
