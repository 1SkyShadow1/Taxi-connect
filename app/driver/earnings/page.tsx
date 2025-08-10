
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EarningsPage() {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showWithdraw, setShowWithdraw] = useState(false);

  const earningsData = {
    daily: {
      total: 540,
      trips: 18,
      hours: 8.5,
      breakdown: [
        { time: '06:00', amount: 45, trips: 3 },
        { time: '08:00', amount: 85, trips: 4 },
        { time: '12:00', amount: 120, trips: 6 },
        { time: '17:00', amount: 290, trips: 5 }
      ]
    },
    weekly: {
      total: 3240,
      trips: 94,
      hours: 45,
      breakdown: [
        { day: 'Mon', amount: 520, trips: 16 },
        { day: 'Tue', amount: 485, trips: 14 },
        { day: 'Wed', amount: 380, trips: 12 },
        { day: 'Thu', amount: 445, trips: 13 },
        { day: 'Fri', amount: 620, trips: 18 },
        { day: 'Sat', amount: 790, trips: 21 }
      ]
    },
    monthly: {
      total: 12840,
      trips: 342,
      hours: 180,
      breakdown: [
        { week: 'Week 1', amount: 3240, trips: 94 },
        { week: 'Week 2', amount: 3120, trips: 87 },
        { week: 'Week 3', amount: 3380, trips: 92 },
        { week: 'Week 4', amount: 3100, trips: 69 }
      ]
    }
  };

  const currentData = earningsData[timeFilter];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/driver" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Earnings</span>
          </Link>
          <button 
            onClick={() => setShowWithdraw(true)}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium !rounded-button"
          >
            Withdraw
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Time Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="grid grid-cols-3 gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`py-2 px-4 rounded-xl text-sm font-medium !rounded-button ${ 
                  timeFilter === filter 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-green-100 text-sm mb-2">{timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Earnings</p>
            <h2 className="text-4xl font-bold mb-4">R{currentData.total.toLocaleString()}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-100 text-xs">Total Trips</p>
                <p className="text-white text-lg font-semibold">{currentData.trips}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Hours Worked</p>
                <p className="text-white text-lg font-semibold">{currentData.hours}h</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">R{Math.round(currentData.total / currentData.trips)}</div>
              <div className="text-sm text-blue-700">Avg per Trip</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">R{Math.round(currentData.total / currentData.hours)}</div>
              <div className="text-sm text-purple-700">Per Hour</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(currentData.trips / (timeFilter === 'daily' ? 1 : timeFilter === 'weekly' ? 7 : 30))}</div>
              <div className="text-sm text-orange-700">Trips/Day</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-green-700">Rating</div>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Breakdown</h3>
          <div className="space-y-3">
            {currentData.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">
                    {timeFilter === 'daily' ? item.time : 
                     timeFilter === 'weekly' ? item.day : 
                     item.week}
                  </p>
                  <p className="text-sm text-gray-600">{item.trips} trips</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">R{item.amount}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(item.amount / Math.max(...currentData.breakdown.map(b => b.amount))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Info */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-900 mb-4">Payout Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Available Balance</span>
              <span className="font-semibold text-green-600">R{currentData.total}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Pending Withdrawal</span>
              <span className="font-semibold text-orange-600">R0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">Next Payout</span>
              <span className="text-sm text-gray-600">Tomorrow, 9:00 AM</span>
            </div>
          </div>
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Withdraw Earnings</h3>
              <button
                onClick={() => setShowWithdraw(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">R{currentData.total}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none text-lg font-semibold"
                max={currentData.total}
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Bank Account</p>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-bank-line text-white"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Standard Bank</p>
                  <p className="text-sm text-gray-600">**** 7891</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium !rounded-button"
              >
                Withdraw
              </button>
            </div>
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
              <i className="ri-money-dollar-circle-line text-blue-500 text-lg"></i>
            </div>
            <span className="text-xs text-blue-500 font-medium mt-1">Earnings</span>
          </Link>
          <Link href="/driver/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Trips</span>
          </Link>
          <Link href="/driver/profile" className="flex flex-col items-center py-2 px-1">
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
