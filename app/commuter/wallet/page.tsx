'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getWallet, getTransactions, topUp, WalletSummary, TransactionRow } from '@/lib/walletClient';
import { supabase } from '@/lib/supabase';

export default function WalletPage() {
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [tx, setTx] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupError, setTopupError] = useState<string|null>(null);
  const [processingMsg, setProcessingMsg] = useState('Processing...');

  useEffect(() => {
    (async () => {
      try {
        // Enforce commuter role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = '/auth/commuter'; return; }
        const userType = user.user_metadata?.user_type;
        if (userType && userType !== 'commuter') { window.location.href = '/'; return; }
        const [w, transactions] = await Promise.all([getWallet(), getTransactions()]);
        setWallet(w); setTx(transactions || []);
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const balance = wallet?.balance || 0;
  const transactions = tx;

  const handleTopup = async () => {
    if (!topupAmount || parseFloat(topupAmount) < 10) { alert('Minimum top-up amount is R10'); return; }
    setIsProcessing(true); setTopupError(null); setProcessingMsg('Authorizing payment...');
    try {
      await topUp(parseFloat(topupAmount), selectedMethod);
      setProcessingMsg('Updating wallet...');
      const [w, transactions] = await Promise.all([getWallet(), getTransactions()]);
      setWallet(w); setTx(transactions);
      setShowTopup(false); setTopupAmount('');
    } catch(e:any){ setTopupError(e.message || 'Top-up failed'); }
    finally { setIsProcessing(false); }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'ri-bank-card-line',
      description: 'Visa, Mastercard, Amex',
      fee: 'No fees'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'ri-bank-line',
      description: 'FNB, Standard Bank, ABSA, Nedbank',
      fee: 'No fees'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: 'ri-smartphone-line',
      description: 'Vodacom, MTN, Cell C',
      fee: 'R2.50 fee'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">My Wallet</span>
          </Link>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-more-2-line text-gray-600 text-xl"></i>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-100 text-sm">Available Balance</p>
                <p className="text-3xl font-bold" suppressHydrationWarning={true}>R{balance.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-wallet-line text-white text-xl"></i>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs">Last updated</p>
                <p className="text-orange-100 text-sm" suppressHydrationWarning={true}>
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <button
                onClick={() => setShowTopup(true)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm !rounded-button hover:bg-orange-50 transition-colors"
              >
                Top Up
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setShowTopup(true)}
            className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-add-line text-green-600 text-xl"></i>
            </div>
            <p className="font-medium text-gray-900 text-sm">Top Up</p>
          </button>

          <Link href="/commuter/wallet/send" className="block">
            <div className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-send-plane-line text-blue-600 text-xl"></i>
              </div>
              <p className="font-medium text-gray-900 text-sm">Send Money</p>
            </div>
          </Link>

          <Link href="/commuter/wallet/history" className="block">
            <div className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-history-line text-purple-600 text-xl"></i>
              </div>
              <p className="font-medium text-gray-900 text-sm">History</p>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <Link href="/commuter/wallet/history" className="text-orange-600 text-sm font-medium hover:text-orange-700">
                View All
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? <div className='p-4 text-sm text-gray-500'>Loading...</div> : transactions.slice(0, 5).map((transaction) => {
              const tType = (transaction as any).type ?? transaction.transaction_type; // backward compatibility
              return (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tType === 'ride' ? 'bg-orange-100' :
                      tType === 'topup' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <i className={`${tType === 'ride' ? 'ri-taxi-line text-orange-600' :
                        tType === 'topup' ? 'ri-add-line text-green-600' :
                        'ri-arrow-go-back-line text-blue-600'}`}></i>
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
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            )})}
            {!loading && transactions.length === 0 && <div className='p-6 text-center text-sm text-gray-500'>No transactions yet.</div>}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <i className="ri-shield-check-line text-white text-sm"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Your money is secure</h4>
              <p className="text-sm text-blue-700">All transactions are encrypted and your wallet is protected by bank-level security.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Top-up Modal */}
      {showTopup && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-5/6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Top Up Wallet</h3>
              <button
                onClick={() => setShowTopup(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">R</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl border-none text-lg font-semibold"
                  min="10"
                  max="2000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum: R10 • Maximum: R2,000</p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopupAmount(amount.toString())}
                  className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors !rounded-button"
                >
                  R{amount}
                </button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedMethod === method.id ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          <i className={`${method.icon} ${
                            selectedMethod === method.id ? 'text-orange-600' : 'text-gray-600'
                          }`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <p className="text-xs text-green-600 font-medium">{method.fee}</p>
                        </div>
                      </div>
                      {selectedMethod === method.id && (
                        <i className="ri-check-line text-orange-600"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleTopup}
              disabled={!topupAmount || parseFloat(topupAmount) < 10 || isProcessing}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg !rounded-button hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {processingMsg}
                </div>
              ) : (
                `Continue with R${topupAmount || '0'}`
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your payment information is encrypted and secure. Funds will be available immediately.
            </p>
            {topupError && <p className='text-xs text-red-600 mt-2'>{topupError}</p>}
          </div>
        </div>
      )}

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
