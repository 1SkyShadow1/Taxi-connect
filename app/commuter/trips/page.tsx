'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bookingsFunction, BookingRow, getUserBookings } from '@/lib/bookingsClient';

// Define the Trip type based on the currentTrips and tripHistory objects
interface Trip {
  id: string;
  driver: string;
  vehicle: string;
  route: string;
  status: string;
  fare: string;
  pickup: string;
  destination: string;
  estimatedArrival?: string;
  rating: number;
  driverLocation?: { lat: number; lng: number };
  date?: string;
  time?: string;
}

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally { setLoading(false); }
    })();
  }, []);

  const currentTrips = bookings.filter(b => ['pending','accepted','in_progress','picked_up'].includes(b.status));
  const tripHistory = bookings.filter(b => ['completed','cancelled'].includes(b.status));

  const handleTrackTaxi = (trip: Trip) => {
    // Open live tracking in Google Maps
    const destination = `${trip.driverLocation?.lat},${trip.driverLocation?.lng}`;
    const trackingUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(trackingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">My Trips</span>
          </Link>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-more-2-line text-gray-600 text-xl"></i>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-14 w-full bg-white border-b border-gray-200 z-40">
        <div className="flex px-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'current'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Current Trips
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Trip History
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="pt-28 pb-20 px-4">
        {activeTab === 'current' && (
          <div className="space-y-4">
            {loading ? <div className='text-center text-gray-500'>Loading...</div> : currentTrips.length > 0 ? (
              currentTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <i className="ri-taxi-line text-white"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{trip.driver?.full_name || 'Unassigned'}</h3>
                        <p className="text-sm text-gray-600">{trip.booking_type}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                      {trip.status.replace('_',' ')}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{trip.pickup_location}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{trip.destination_location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-green-600">R{trip.fare_amount}</span>
                    {trip.pickup_time && <span className="text-sm text-gray-600">Picked {new Date(trip.pickup_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium !rounded-button hover:bg-orange-600 transition-colors">
                      Details
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg !rounded-button">
                      <i className="ri-phone-line"></i>
                    </button>
                    {trip.status === 'pending' && <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg !rounded-button">
                      <i className="ri-close-line"></i>
                    </button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-taxi-line text-gray-400 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Active Trips</h3>
                <p className="text-gray-600 mb-4">You don't have any ongoing trips</p>
                <Link href="/commuter">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium !rounded-button">
                    Book a Ride
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {loading ? <div className='text-center text-gray-500'>Loading...</div> : tripHistory.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <i className="ri-taxi-line text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{trip.driver?.full_name || 'Unassigned'}</h3>
                      <p className="text-sm text-gray-600">{new Date(trip.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{trip.completion_time ? new Date(trip.completion_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{trip.pickup_location}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{trip.destination_location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">R{trip.fare_amount}</span>
                  <div className="flex items-center space-x-3">
                    <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium !rounded-button">
                      Rebook
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <i className="ri-route-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">My Trips</span>
          </Link>
          <Link href="/commuter/wallet" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-wallet-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Wallet</span>
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
