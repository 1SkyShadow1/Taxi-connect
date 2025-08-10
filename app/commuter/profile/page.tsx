'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  user_type?: string;
  id_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
}

export default function ProfilePage() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth/commuter'; return; }
      if (user.user_metadata?.user_type && user.user_metadata.user_type !== 'commuter') { window.location.href = '/'; return; }
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) setProfile(data as UserProfile);
      setLoading(false);
    })();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (loading) {
    return <div className='pt-32 text-center text-gray-500'>Loading profile...</div>;
  }
  if (!profile) {
    return <div className='pt-32 text-center text-gray-500'>No profile found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Profile</span>
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
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center relative overflow-hidden">
              <span className='text-white font-semibold text-xl'>{profile.full_name?.[0] || 'U'}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.full_name}</h2>
              <p className="text-gray-600">{profile.user_type === 'commuter' ? 'Regular Commuter' : profile.user_type}</p>
              <div className="flex flex-wrap items-center mt-2 gap-4 text-sm">
                <div className="flex items-center"><i className="ri-mail-line text-orange-500 mr-1"/>{profile.email}</div>
                {profile.phone && <div className="flex items-center"><i className="ri-smartphone-line text-green-500 mr-1"/>{profile.phone}</div>}
              </div>
            </div>
            <button onClick={() => setShowEditProfile(true)} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium !rounded-button">Edit</button>
          </div>
        </div>
        {/* Stats placeholder (could be fetched) */}
        <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-md">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">—</p><p className="text-sm text-gray-600">Trips</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">—</p><p className="text-sm text-gray-600">Spent</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-900">—</p><p className="text-sm text-gray-600">Months</p></div>
          </div>
        </div>
        {/* Menus remain same */}
        <div className="px-4 mt-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Account</h3></div>
            <div className="divide-y divide-gray-100">
              <Link href="/commuter/profile/personal-info" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><i className="ri-user-line text-blue-600"></i></div>
                  <span className="text-gray-900">Personal Information</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
              <Link href="/commuter/profile/emergency-contacts" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><i className="ri-phone-line text-red-600"></i></div>
                  <span className="text-gray-900">Emergency Contacts</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
              <Link href="/commuter/profile/payment-methods" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><i className="ri-bank-card-line text-green-600"></i></div>
                  <span className="text-gray-900">Payment Methods</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
            </div>
          </div>
          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Preferences</h3></div>
            <div className="divide-y divide-gray-100">
              <Link href="/commuter/profile/notifications" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><i className="ri-notification-3-line text-purple-600"></i></div>
                  <span className="text-gray-900">Notifications</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
              <Link href="/commuter/profile/language" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><i className="ri-global-line text-orange-600"></i></div>
                  <span className="text-gray-900">Language</span>
                </div>
                <div className="flex items-center space-x-2"><span className="text-sm text-gray-500">English</span><i className="ri-arrow-right-s-line text-gray-400"></i></div>
              </Link>
              <Link href="/commuter/profile/privacy" className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><i className="ri-shield-user-line text-gray-600"></i></div>
                  <span className="text-gray-900">Privacy & Security</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </Link>
            </div>
          </div>
          {/* Support */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Support</h3></div>
              <div className="divide-y divide-gray-100">
                <Link href="/help" className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><i className="ri-question-line text-blue-600"></i></div><span className="text-gray-900">Help Center</span></div><i className="ri-arrow-right-s-line text-gray-400"></i>
                </Link>
                <Link href="/commuter/profile/feedback" className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"><i className="ri-feedback-line text-yellow-600"></i></div><span className="text-gray-900">Send Feedback</span></div><i className="ri-arrow-right-s-line text-gray-400"></i>
                </Link>
                <button onClick={handleSignOut} className="flex items-center justify-between p-4 w-full text-left">
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><i className="ri-logout-circle-line text-red-600"></i></div><span className="text-red-600">Sign Out</span></div>
                </button>
              </div>
            </div>
        </div>
      </main>
      {/* Edit Profile Modal */}
      {showEditProfile && profile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="w-8 h-8 flex items-center justify-center"><i className="ri-close-line text-gray-400 text-xl"></i></button>
            </div>
            <EditProfileForm profile={profile} onClose={()=>setShowEditProfile(false)} onSaved={p=>setProfile(p)} />
          </div>
        </div>
      )}
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/commuter" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-home-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">Home</span></Link>
          <Link href="/commuter/trips" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-route-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">My Trips</span></Link>
          <Link href="/commuter/wallet" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-wallet-line text-gray-400 text-lg"></i></div><span className="text-xs text-gray-400 mt-1">Wallet</span></Link>
          <Link href="/commuter/profile" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-user-line text-orange-500 text-lg"></i></div><span className="text-xs text-orange-500 font-medium mt-1">Profile</span></Link>
        </div>
      </nav>
    </div>
  );
}

function EditProfileForm({ profile, onClose, onSaved }: { profile: UserProfile; onClose: ()=>void; onSaved: (p:UserProfile)=>void }) {
  const [form, setForm] = useState({ full_name: profile.full_name, phone: profile.phone || '', address: profile.address || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true); setError(null);
    const { error, data } = await supabase.from('users').update({ full_name: form.full_name, phone: form.phone, address: form.address }).eq('id', profile.id).select().single();
    if (error) { setError(error.message); setSaving(false); return; }
    onSaved(data as UserProfile); setSaving(false); onClose();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input value={form.full_name} onChange={e=>setForm(f=>({...f, full_name:e.target.value}))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" />
      </div>
      {error && <p className='text-xs text-red-600'>{error}</p>}
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">Cancel</button>
        <button disabled={saving} onClick={save} className={`flex-1 py-3 rounded-xl font-medium text-white ${saving ? 'bg-gray-400' : 'bg-primary-500 hover:bg-primary-600'}`}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}