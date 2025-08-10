'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DriverProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  license_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  license_plate?: string;
}

export default function DriverProfilePage() {
  const [showDocuments, setShowDocuments] = useState(false);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRow } = await supabase.from('users').select('*').eq('id', user.id).single();
        const { data: driverRow } = await supabase.from('drivers').select('*').eq('user_id', user.id).single();
        if (userRow) {
          setProfile({
            id: userRow.id,
            full_name: userRow.full_name,
            email: userRow.email,
            phone: userRow.phone,
            license_number: driverRow?.license_number,
            vehicle_make: driverRow?.vehicle_make,
            vehicle_model: driverRow?.vehicle_model,
            vehicle_year: driverRow?.vehicle_year,
            license_plate: driverRow?.license_plate
          });
        }
      }
      setLoading(false);
    })();
  }, []);

  async function handleSignOut() { await supabase.auth.signOut(); window.location.href = '/'; }

  if (loading) return <div className='pt-32 text-center text-gray-500'>Loading profile...</div>;
  if (!profile) return <div className='pt-32 text-center text-gray-500'>No driver profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/driver" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Driver Profile</span>
          </Link>
          <button className="w-8 h-8 flex items-center justify-center">
            <i className="ri-settings-3-line text-gray-600 text-xl"></i>
          </button>
        </div>
      </header>
      {/* Content */}
      <main className="pt-16 pb-20">
        <div className="bg-white px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
              <span className='text-white font-semibold text-xl'>{profile.full_name?.[0] || 'D'}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.full_name}</h2>
              <p className="text-gray-600">Professional Driver</p>
              <div className="flex flex-wrap items-center mt-2 gap-4 text-sm">
                <div className="flex items-center"><i className="ri-mail-line text-blue-500 mr-1"/>{profile.email}</div>
                {profile.phone && <div className="flex items-center"><i className="ri-smartphone-line text-green-500 mr-1"/>{profile.phone}</div>}
              </div>
            </div>
          </div>
        </div>
        {/* Vehicle Info (from driver profile if available) */}
        <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-md">
          <h3 className='font-semibold text-gray-900 mb-3'>Vehicle Information</h3>
          {profile.vehicle_make ? (
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div><p className='text-gray-600'>Vehicle</p><p className='font-medium text-gray-900'>{profile.vehicle_make} {profile.vehicle_model}</p></div>
              <div><p className='text-gray-600'>Year</p><p className='font-medium text-gray-900'>{profile.vehicle_year}</p></div>
              <div><p className='text-gray-600'>Plate</p><p className='font-medium text-gray-900'>{profile.license_plate}</p></div>
              <div><p className='text-gray-600'>License #</p><p className='font-medium text-gray-900'>{profile.license_number}</p></div>
            </div>
          ) : <p className='text-sm text-gray-600'>No vehicle data yet.</p> }
        </div>
        {/* Menu (trimmed) */}
        <div className="px-4 mt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Documents & Verification</h3></div>
            <div className="divide-y divide-gray-100">
              <button onClick={() => setShowDocuments(true)} className="flex items-center justify-between p-4 w-full text-left">
                <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><i className="ri-file-text-line text-green-600"></i></div><span className="text-gray-900">Driver Documents</span></div>
                <div className="flex items-center space-x-2"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span><i className="ri-arrow-right-s-line text-gray-400"></i></div>
              </button>
              <Link href="/driver/profile/banking" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><i className="ri-bank-line text-green-600"></i></div><span className="text-gray-900">Banking Details</span></div><i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
              <button onClick={handleSignOut} className="flex items-center justify-between p-4 w-full text-left">
                <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><i className="ri-logout-circle-line text-red-600"></i></div><span className="text-red-600">Sign Out</span></div>
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Documents Modal */}
      {showDocuments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Driver Documents</h3>
              <button onClick={() => setShowDocuments(false)} className="w-8 h-8 flex items-center justify-center"><i className="ri-close-line text-gray-400 text-xl"></i></button>
            </div>
            <div className="space-y-3">
              {['Driver\'s License','Identity Document','PRDP Certificate'].map(doc => (
                <div key={doc} className='flex items-center justify-between p-3 bg-blue-50 rounded-xl'>
                  <div className='flex items-center gap-3'><i className='ri-file-text-line text-blue-600'></i><span className='text-sm font-medium text-gray-900'>{doc}</span></div>
                  <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>Valid</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowDocuments(false)} className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-medium !rounded-button">Close</button>
          </div>
        </div>
      )}
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/driver" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-dashboard-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">Dashboard</span></Link>
          <Link href="/driver/trips" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-route-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">Trips</span></Link>
          <Link href="/driver/earnings" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-money-dollar-circle-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">Earnings</span></Link>
          <Link href="/driver/profile" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-user-line text-blue-500 text-lg"></i></div><span className="text-xs text-blue-500 font-medium mt-1">Profile</span></Link>
        </div>
      </nav>
    </div>
  );
}
