
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MyRoutesPage() {
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'saved'>('active');

  const [activeRoutes] = useState([
    {
      id: '1',
      name: 'JHB CBD to Soweto',
      from: 'Park Station',
      to: 'Maponya Mall',
      distance: '24.5 km',
      averageTime: '35 min',
      fare: 'R13',
      passengers: 16,
      frequency: 'Every 15 min',
      status: 'active',
      earnings: 'R208/day'
    },
    {
      id: '2',
      name: 'Sandton to Alexandra',
      from: 'Sandton City',
      to: 'Alexandra Mall',
      distance: '18.2 km',
      averageTime: '28 min',
      fare: 'R11',
      passengers: 14,
      frequency: 'Every 20 min',
      status: 'active',
      earnings: 'R154/day'
    }
  ]);

  const [savedRoutes] = useState([
    {
      id: '3',
      name: 'Pretoria to Centurion',
      from: 'Church Square',
      to: 'Centurion Mall',
      distance: '15.8 km',
      averageTime: '22 min',
      fare: 'R8',
      passengers: 12,
      frequency: 'Every 25 min',
      status: 'saved',
      potentialEarnings: 'R96/day'
    },
    {
      id: '4',
      name: 'Rosebank to Melville',
      from: 'Rosebank Mall',
      to: 'Melville Shopping Centre',
      distance: '12.4 km',
      averageTime: '18 min',
      fare: 'R10',
      passengers: 10,
      frequency: 'Every 30 min',
      status: 'saved',
      potentialEarnings: 'R100/day'
    }
  ]);

  const popularRoutes = [
    { name: 'OR Tambo to Sandton', demand: 'High', fare: 'R85' },
    { name: 'Midrand to Centurion', demand: 'Medium', fare: 'R12' },
    { name: 'Germiston to JHB CBD', demand: 'High', fare: 'R15' },
    { name: 'Benoni to Boksburg', demand: 'Medium', fare: 'R9' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/driver/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">My Routes</span>
          </Link>
          <button 
            onClick={() => setShowAddRoute(true)}
            className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium !rounded-button"
          >
            Add Route
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-14 w-full bg-white border-b border-gray-200 z-40">
        <div className="flex px-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'active' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Active Routes ({activeRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'saved' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Saved Routes ({savedRoutes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="pt-28 pb-20 px-4">
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-600">{route.frequency} • {route.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{route.earnings}</p>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{route.from}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{route.to}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-blue-600 font-medium">Fare</p>
                    <p className="text-sm font-bold text-blue-800">{route.fare}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-purple-600 font-medium">Time</p>
                    <p className="text-sm font-bold text-purple-800">{route.averageTime}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-orange-600 font-medium">Capacity</p>
                    <p className="text-sm font-bold text-orange-800">{route.passengers}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg text-sm font-medium !rounded-button">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg !rounded-button">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg !rounded-button">
                    <i className="ri-pause-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-600">{route.frequency} • {route.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{route.potentialEarnings}</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Saved
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{route.from}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{route.to}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-blue-600 font-medium">Fare</p>
                    <p className="text-sm font-bold text-blue-800">{route.fare}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-purple-600 font-medium">Time</p>
                    <p className="text-sm font-bold text-purple-800">{route.averageTime}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-orange-600 font-medium">Capacity</p>
                    <p className="text-sm font-bold text-orange-800">{route.passengers}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium !rounded-button">
                    Activate Route
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg !rounded-button">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg !rounded-button">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* Popular Routes */}
            <div className="bg-white rounded-2xl p-4 shadow-md mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Routes</h3>
              <div className="space-y-3">
                {popularRoutes.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{route.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          route.demand === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {route.demand} Demand
                        </span>
                        <span className="text-sm text-gray-600">{route.fare}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium !rounded-button">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Route Modal */}
      {showAddRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-5/6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Route</h3>
              <button
                onClick={() => setShowAddRoute(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
                <input
                  type="text"
                  placeholder="e.g., JHB CBD to Soweto"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Point</label>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  placeholder="Enter drop-off location"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fare (R)</label>
                  <input
                    type="number"
                    placeholder="15"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency (min)</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    defaultValue="06:00"
                    className="px-4 py-3 bg-gray-50 rounded-xl border-none"
                  />
                  <input
                    type="time"
                    defaultValue="20:00"
                    className="px-4 py-3 bg-gray-50 rounded-xl border-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <button
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddRoute(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
              >
                Save as Draft
              </button>
              <button
                onClick={() => setShowAddRoute(false)}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium !rounded-button"
              >
                Activate Route
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
