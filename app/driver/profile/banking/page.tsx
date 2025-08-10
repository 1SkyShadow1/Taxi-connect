'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BankingDetailsPage() {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [bankAccounts] = useState([
    {
      id: '1',
      bankName: 'Standard Bank',
      accountType: 'Savings',
      accountNumber: '**** 7891',
      fullAccountNumber: '1234567891',
      branchCode: '051001',
      isPrimary: true,
      status: 'verified'
    },
    {
      id: '2',
      bankName: 'FNB',
      accountType: 'Cheque',
      accountNumber: '**** 4523',
      fullAccountNumber: '9876544523',
      branchCode: '250655',
      isPrimary: false,
      status: 'pending'
    }
  ]);

  const banks = [
    { name: 'Standard Bank', code: '051' },
    { name: 'FNB', code: '250' },
    { name: 'ABSA', code: '632' },
    { name: 'Nedbank', code: '198' },
    { name: 'Capitec Bank', code: '470' },
    { name: 'African Bank', code: '430' },
    { name: 'Investec', code: '580' },
    { name: 'Bidvest Bank', code: '462' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/driver/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Banking Details</span>
          </Link>
          <button 
            onClick={() => setShowAddAccount(true)}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium !rounded-button"
          >
            Add Account
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Current Accounts */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Bank Accounts</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {bankAccounts.map((account) => (
              <div key={account.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <i className="ri-bank-line text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.bankName}</h4>
                      <p className="text-sm text-gray-600">{account.accountType} Account</p>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.isPrimary && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Primary
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.status === 'verified' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {account.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowEditAccount(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium !rounded-button"
                  >
                    Edit Details
                  </button>
                  {!account.isPrimary && (
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium !rounded-button">
                      Set Primary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Payout Schedule</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Next Payout</p>
                <p className="text-sm text-gray-600">Tomorrow, 9:00 AM</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">R540.00</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold text-gray-900">Daily</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="font-semibold text-gray-900">1-2 Hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Tax Information</h3>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Tax Number</span>
              <span className="font-medium text-gray-900">9876543210</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Tax Certificate</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Valid</span>
                <button className="text-blue-600 text-sm font-medium">View</button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Monthly Statement</span>
              <button className="text-blue-600 text-sm font-medium">Download</button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-5/6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
              <button
                onClick={() => setShowAddAccount(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none">
                  <option value="">Select your bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none">
                  <option value="">Select account type</option>
                  <option value="savings">Savings Account</option>
                  <option value="cheque">Cheque Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Code</label>
                <input
                  type="text"
                  placeholder="Enter branch code"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Enter full name as on account"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddAccount(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddAccount(false)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium !rounded-button"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditAccount && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Account</h3>
              <button
                onClick={() => setShowEditAccount(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="ri-bank-line text-white"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedAccount.bankName}</p>
                    <p className="text-sm text-gray-600">{selectedAccount.fullAccountNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Update Account Details</span>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Verify Account</span>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors text-red-600">
                  <div className="flex items-center justify-between">
                    <span>Remove Account</span>
                    <i className="ri-delete-bin-line"></i>
                  </div>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowEditAccount(false)}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/driver" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-dashboard-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Dashboard</span>
          </Link>
          <Link href="/driver/earnings" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Earnings</span>
          </Link>
          <Link href="/driver/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Trips</span>
          </Link>
          <Link href="/driver/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-blue-500 text-lg"></i>
            </div>
            <span className="text-xs text-blue-500 font-medium mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}