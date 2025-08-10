'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTransactions, TransactionRow } from '@/lib/walletClient';

export default function WalletHistoryPage() {
  const [filterType, setFilterType] = useState<'all' | 'rides' | 'topups' | 'refunds'>('all');
  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [allTransactions, setAllTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const tx = await getTransactions(); setAllTransactions(tx || []); } catch(e){ console.error(e); setAllTransactions([]);} finally { setLoading(false);} })(); }, []);

  const filterTransactions = () => {
    if (!allTransactions || !Array.isArray(allTransactions)) return [] as any[];
    let filtered = (allTransactions ?? []).map(t => ({
      ...t,
      type: (t as any).transaction_type || (t as any).type,
      date: t.created_at ? new Date(t.created_at).toISOString().slice(0,10) : '',
      time: t.created_at ? new Date(t.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''
    })) as any[];
    if (filterType !== 'all') {
      filtered = filtered.filter(t => {
        if (filterType === 'rides') return t.type === 'payment';
        if (filterType === 'topups') return t.type === 'topup';
        if (filterType === 'refunds') return t.type === 'refund';
        return true;
      });
    }
    if (dateFilter !== 'all') {
      const days = { '7days':7,'30days':30,'90days':90 }[dateFilter];
      const cutoffDate = new Date(); cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(t => t.created_at ? new Date(t.created_at) >= cutoffDate : false);
    }
    return filtered;
  };

  const filteredTransactions = filterTransactions();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ride': return 'ri-taxi-line';
      case 'topup': return 'ri-add-line';
      case 'refund': return 'ri-arrow-go-back-line';
      default: return 'ri-money-dollar-circle-line';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ride': return 'text-orange-600 bg-orange-100';
      case 'topup': return 'text-green-600 bg-green-100';
      case 'refund': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotals = () => {
    const totals = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.spending += Math.abs(transaction.amount);
      }
      return acc;
    }, { income: 0, spending: 0 });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter/wallet" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Transaction History</span>
          </Link>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-download-line text-gray-600 text-xl"></i>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-arrow-down-line text-white text-xs"></i>
              </div>
              <span className="text-sm text-green-700 font-medium">Money In</span>
            </div>
            <p className="text-2xl font-bold text-green-800">R{totals.income.toFixed(2)}</p>
          </div>
          
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <i className="ri-arrow-up-line text-white text-xs"></i>
              </div>
              <span className="text-sm text-red-700 font-medium">Money Out</span>
            </div>
            <p className="text-2xl font-bold text-red-800">R{totals.spending.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="space-y-4">
            {/* Transaction Type Filter */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Transaction Type</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'rides', label: 'Rides' },
                  { key: 'topups', label: 'Top-ups' },
                  { key: 'refunds', label: 'Refunds' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key as any)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter.key
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Time Period</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: '7days', label: '7 Days' },
                  { key: '30days', label: '30 Days' },
                  { key: '90days', label: '90 Days' },
                  { key: 'all', label: 'All Time' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setDateFilter(filter.key as any)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === filter.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </h3>
              <span className="text-sm text-gray-600">
                {dateFilter === '7days' && 'Last 7 days'}
                {dateFilter === '30days' && 'Last 30 days'}
                {dateFilter === '90days' && 'Last 90 days'}
                {dateFilter === 'all' && 'All time'}
              </span>
            </div>
          </div>

          {loading ? <div className='p-6 text-center text-sm text-gray-500'>Loading...</div> : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                        <i className={`${getTransactionIcon(transaction.type)}`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{transaction.date} • {transaction.time}</span>
                          {transaction.driver && (
                            <>
                              <span>•</span>
                              <span>{transaction.driver}</span>
                            </>
                          )}
                          {transaction.method && (
                            <>
                              <span>•</span>
                              <span>{transaction.method}</span>
                            </>
                          )}
                        </div>
                        {transaction.receipt && (
                          <p className="text-xs text-gray-500 mt-1">Receipt: {transaction.receipt}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}R{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-history-line text-gray-400 text-2xl"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-2xl p-4 shadow-md mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Export Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
              <i className="ri-file-pdf-line mr-2"></i>
              Export PDF
            </button>
            <button className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
              <i className="ri-file-excel-line mr-2"></i>
              Export CSV
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/commuter" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          <Link href="/commuter/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">My Trips</span>
          </Link>
          <Link href="/commuter/wallet" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-wallet-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">Wallet</span>
          </Link>
          <Link href="/commuter/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}