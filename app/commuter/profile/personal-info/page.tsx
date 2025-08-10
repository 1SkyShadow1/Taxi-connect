'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PersonalInfoPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    id_number: '',
    address: '',
    date_of_birth: '',
    gender: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (error) { setError(error.message); setLoading(false); return; }
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        id_number: data.id_number || '',
        address: data.address || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || ''
      });
      setLoading(false);
    })();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.phone.trim() || !/^(\+?\d{7,15})$/.test(formData.phone.replace(/\s/g, ''))) errors.phone = 'Valid phone is required.';
    if (!formData.address.trim()) errors.address = 'Address is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!profile) return;
    setSaving(true); setError(null);
    try {
      const { data, error } = await supabase.from('users')
        .update({ phone: formData.phone, address: formData.address, gender: formData.gender })
        .eq('id', profile.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
    } catch (e:any) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className='pt-32 text-center text-gray-500'>Loading personal information...</div>;
  if (!profile) return <div className='pt-32 text-center text-gray-500'>No profile found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Personal Information</span>
          </Link>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className={`px-3 py-1 rounded-lg text-sm font-medium !rounded-button ${
              isEditing ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            } ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isEditing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="space-y-6">
            {/* Profile Picture Placeholder (future avatar) */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                {(profile.full_name || 'U').slice(0,1)}
              </div>
              {isEditing && (
                <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium !rounded-button cursor-not-allowed">
                  Change Photo (coming soon)
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Non-editable core identity fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={formData.full_name} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none" />
                <p className="text-xs text-gray-500 mt-1">Name matches your verified ID and cannot be changed here.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" value={formData.email} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none" />
                <p className="text-xs text-gray-500 mt-1">Contact support to change your email.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" value={formData.date_of_birth} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                  <input type="text" value={formData.id_number} disabled className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none" />
                </div>
              </div>

              {/* Editable contact/address fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e)=>handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 ${isEditing ? 'bg-gray-50' : 'bg-gray-100'} ${formErrors.phone ? 'border border-red-500' : ''}`}
                />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e)=>handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 resize-none ${isEditing ? 'bg-gray-50' : 'bg-gray-100'} ${formErrors.address ? 'border border-red-500' : ''}`}
                />
                {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e)=>handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 ${isEditing ? 'bg-gray-50' : 'bg-gray-100'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Verification Status */}
            <div className={`${formData.id_number ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} rounded-xl p-4 border`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${formData.id_number ? 'bg-green-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center`}>
                  <i className={`${formData.id_number ? 'ri-shield-check-line' : 'ri-shield-keyhole-line'} text-white`}></i>
                </div>
                <div>
                  <h4 className={`font-medium ${formData.id_number ? 'text-green-800' : 'text-yellow-800'}`}>{formData.id_number ? 'Account Verified' : 'Verification Pending'}</h4>
                  <p className={`text-sm ${formData.id_number ? 'text-green-700' : 'text-yellow-700'}`}>
                    {formData.id_number ? 'Your identity information is on file.' : 'Please complete ID verification to unlock all features.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons when editing */}
            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={() => { setIsEditing(false); setFormErrors({}); /* reset form to profile values */ setFormData(f=>({ ...f,
                    phone: profile.phone || '', address: profile.address || '', gender: profile.gender || '' })); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium !rounded-button disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            {error && <p className='text-xs text-red-600'>{error}</p>}
          </div>
        </div>
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
              <i className="ri-user-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">Profile</span>
          </Link>
        </div>
      </nav>
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          Personal information updated successfully!
        </div>
      )}
    </div>
  );
}