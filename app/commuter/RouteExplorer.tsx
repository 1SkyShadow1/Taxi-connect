'use client';

import { useState } from 'react';

export default function RouteExplorer() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes = [
    {
      id: '1',
      name: 'JHB CBD to Soweto',
      stops: ['Park Station', 'Ellis Park', 'Booysens', 'Eldorado Park', 'Soweto'],
      fare: 'R12-15',
      duration: '45-60 min',
      frequency: 'Every 5-10 min',
      color: 'bg-orange-500'
    },
    {
      id: '2',
      name: 'Sandton to Alexandra',
      stops: ['Sandton City', 'Marlboro', 'Wynberg', 'Bramley', 'Alexandra'],
      fare: 'R10-12',
      duration: '30-40 min',
      frequency: 'Every 8-12 min',
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: 'Pretoria to Mamelodi',
      stops: ['Church Square', 'Brooklyn', 'Hatfield', 'Silverton', 'Mamelodi'],
      fare: 'R8-10',
      duration: '25-35 min',
      frequency: 'Every 6-10 min',
      color: 'bg-green-500'
    },
    {
      id: '4',
      name: 'Cape Town CBD to Khayelitsha',
      stops: ['Grand Parade', 'Wynberg', 'Mitchell\'s Plain', 'Khayelitsha'],
      fare: 'R15-18',
      duration: '50-70 min',
      frequency: 'Every 10-15 min',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="px-4 space-y-4">
      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search routes or destinations..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm"
          />
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Routes</h3>
        <div className="space-y-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRoute === route.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${route.color} rounded-full mr-3 mt-1`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{route.name}</h4>
                    <p className="text-sm text-gray-600">{route.frequency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{route.fare}</p>
                  <p className="text-xs text-gray-500">{route.duration}</p>
                </div>
              </div>

              {selectedRoute === route.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-2">Route Stops:</h5>
                  <div className="space-y-2">
                    {route.stops.map((stop, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-2 h-2 ${route.color} rounded-full mr-3`}></div>
                        <span className="text-sm text-gray-700">{stop}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium !rounded-button">
                      Book This Route
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm !rounded-button">
                      <i className="ri-star-line"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Route Categories */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Browse by Area</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20city%20skyline%2C%20Johannesburg%20buildings%2C%20modern%20urban%20illustration%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=48&height=48&seq=jhb-icon&orientation=squarish"
                alt="Johannesburg"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Johannesburg</h4>
            <p className="text-xs text-gray-600">25 routes</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20mountain%20and%20ocean%2C%20Cape%20Town%20Table%20Mountain%2C%20modern%20urban%20illustration%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=48&height=48&seq=cpt-icon&orientation=squarish"
                alt="Cape Town"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Cape Town</h4>
            <p className="text-xs text-gray-600">18 routes</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20government%20buildings%2C%20Pretoria%20Union%20Buildings%2C%20modern%20urban%20illustration%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=48&height=48&seq=pta-icon&orientation=squarish"
                alt="Pretoria"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Pretoria</h4>
            <p className="text-xs text-gray-600">15 routes</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20beach%20and%20port%2C%20Durban%20beachfront%2C%20modern%20urban%20illustration%2C%20vibrant%20colors%20with%20soft%20gradients%2C%20minimalist%20design%2C%20smooth%20rounded%20shapes%2C%20subtle%20shading%2C%20no%20outlines%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20playful%20and%20friendly%20aesthetic%2C%20isometric%20perspective%2C%20high%20detail%20quality%2C%20clean%20and%20modern%20look%2C%20single%20object%20focus%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame&width=48&height=48&seq=dbn-icon&orientation=squarish"
                alt="Durban"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Durban</h4>
            <p className="text-xs text-gray-600">12 routes</p>
          </div>
        </div>
      </div>
    </div>
  );
}