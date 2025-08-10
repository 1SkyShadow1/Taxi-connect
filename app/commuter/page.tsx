'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import RouteExplorer from './RouteExplorer';
import RankFinder from './RankFinder';
import NotificationPanel from '../components/NotificationPanel';
import AuthGate from '../components/AuthGate';
import { getUserBookings, BookingRow } from '@/lib/bookingsClient';

export default function CommuterPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'routes' | 'ranks'>('book');
  const [showNotifications, setShowNotifications] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      try { const data = await getUserBookings(); setBookings(data); } catch(e){ console.error(e);} finally { setLoadingBookings(false);} })();
  }, [authenticated]);

  if (!authenticated) {
    return <AuthGate userType='commuter' onAuthenticated={() => setAuthenticated(true)} />
  }

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
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-8 h-8 flex items-center justify-center relative"
            >
              <i className="ri-notification-3-line text-gray-600 text-xl"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <Link href="/commuter/profile">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-user-line text-gray-600 text-xl"></i>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-14 w-full bg-white border-b border-gray-200 z-40">
        <div className="flex px-4">
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'book' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Book Ride
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'routes' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'ranks' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Ranks
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="pt-28 pb-20">
        {activeTab === 'book' && <BookingForm />}
        {activeTab === 'routes' && <RouteExplorer />}
        {activeTab === 'ranks' && <RankFinder />}
        {authenticated && activeTab === 'book' && (
          <div className='mt-6 px-4'>
            <h3 className='text-sm font-semibold text-gray-700 mb-2'>Recent Bookings</h3>
            {loadingBookings ? <p className='text-xs text-gray-500'>Loading...</p> : bookings.slice(0,3).map(b => (
              <div key={b.id} className='bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-800 truncate'>{b.pickup_location} → {b.destination_location}</span>
                  <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize'>{b.status.replace('_',' ')}</span>
                </div>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-gray-500'>{new Date(b.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  <span className='text-xs font-medium text-green-600'>R{b.fare_amount}</span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && !loadingBookings && <p className='text-xs text-gray-500'>No bookings yet.</p>}
          </div>
        )}
      </main>

      {/* Emergency Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-red-500 rounded-full shadow-lg flex items-center justify-center z-50">
        <i className="ri-alarm-warning-fill text-white text-xl"></i>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/commuter" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">Home</span>
          </Link>
          <Link href="/commuter/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">My Trips</span>
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

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}