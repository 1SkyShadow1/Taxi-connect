'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthGate from '../components/AuthGate';
import { getUserBookings, BookingRow, getDriverRequests, acceptBooking } from '@/lib/bookingsClient';

interface TripRequest {
  id: string;
  passenger: string;
  pickup: string;
  destination: string;
  distance: string;
  fare: string;
  eta: string;
  rating: number;
  status: string;
}

export default function DriverPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [requests, setRequests] = useState<BookingRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, b] = await Promise.all([getDriverRequests(), getUserBookings()]);
        setRequests(r);
        setBookings(b);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const todayStats = (() => {
    const today = new Date().toDateString();
    const todays = bookings.filter(b => new Date(b.created_at).toDateString() === today);
    const earnings = todays.reduce((sum,b)=> sum + (b.fare_amount||0), 0);
    const trips = todays.length;
    return { earnings, trips };
  })();

  const activeRequests = requests;

  if (!authenticated) {
    return <AuthGate userType='driver' onAuthenticated={() => setAuthenticated(true)} />
  }

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRequest = async (id: string) => {
    try { await acceptBooking(id); setRequests(prev => prev.filter(r => r.id !== id)); } catch(e){ console.error(e); }
  };
  const handleDeclineRequest = (id: string) => setRequests(prev => prev.filter(r => r.id !== id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-pacifico text-lg text-orange-600">SA Taxi Connect</span>
          </Link>
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-notification-3-line text-gray-600 text-xl"></i>
            </button>
            <Link href="/driver/profile">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white"></i>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Online Status */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600">
                {isOnline ? (
                  <span className="text-green-600 font-medium">● You're online and available</span>
                ) : (
                  <span className="text-gray-500">● You're offline</span>
                )}
              </p>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`px-6 py-3 rounded-xl font-semibold !rounded-button transition-colors ${
                isOnline 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Trip Requests */}
        {isOnline && (
          <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Trip Requests</h3>
              <span className="text-sm text-blue-600 font-medium">{activeRequests.length} pending</span>
            </div>
            {loading ? <p className='text-sm text-gray-500'>Loading...</p> : <div className="space-y-4">
              {activeRequests.map(request => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{request.commuter?.full_name || 'Passenger'}</p>
                      <p className="text-xs text-gray-600">{new Date(request.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">R{request.fare_amount}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div><span className="text-sm text-gray-700">{request.pickup_location}</span></div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div><span className="text-sm text-gray-700">{request.destination_location}</span></div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleAcceptRequest(request.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium !rounded-button hover:bg-green-600 transition-colors">Accept</button>
                    <button onClick={() => handleDeclineRequest(request.id)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium !rounded-button hover:bg-gray-300 transition-colors">Decline</button>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        )}

        {/* No Requests Message */}
        {isOnline && activeRequests.length === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-eye-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Looking for passengers...</h3>
            <p className="text-gray-600">Stay online to receive trip requests in your area</p>
          </div>
        )}

        {/* Today's Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600" suppressHydrationWarning={true}>R{todayStats.earnings.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Earnings</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{todayStats.trips}</p>
              <p className="text-sm text-gray-600">Trips</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/driver/earnings" className="block">
            <div className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
              </div>
              <p className="font-medium text-gray-900 text-sm">Earnings</p>
            </div>
          </Link>
          
          <Link href="/driver/trips" className="block">
            <div className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-route-line text-blue-600 text-xl"></i>
              </div>
              <p className="font-medium text-gray-900 text-sm">Trip History</p>
            </div>
          </Link>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-900 mb-3">Vehicle Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-car-line text-white text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Toyota Quantum</p>
                  <p className="text-sm text-gray-600">CA 123 456 GP</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-600">License</p>
                <p className="text-xs text-blue-800">Valid</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">Insurance</p>
                <p className="text-xs text-green-800">Valid</p>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-600">Service</p>
                <p className="text-xs text-orange-800">Due 15 Feb</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/driver" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">Home</span>
          </Link>
          <Link href="/driver/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Trips</span>
          </Link>
          <Link href="/driver/earnings" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Earnings</span>
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
