'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  useEffect(()=>{(async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/auth/commuter'; return; }
    const userType = user.user_metadata?.user_type;
    if (userType && userType !== 'commuter') { window.location.href = '/'; return; }
    const { data } = await supabase.from('emergency_contacts').select('*').eq('user_id', user.id).order('created_at');
    if (data) setContacts(data);
    setLoading(false);
  })();},[]);

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) return;
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const insert = { user_id: user.id, name: newContact.name, relationship: newContact.relationship, phone: newContact.phone, is_primary: contacts.length === 0 };
    const { data, error } = await supabase.from('emergency_contacts').insert(insert).select().single();
    if (!error && data) { setContacts(c=>[...c, data]); setNewContact({ name:'', relationship:'', phone:'' }); setShowAddContact(false); }
  };

  const removeContact = async (id: string) => {
    await supabase.from('emergency_contacts').delete().eq('id', id);
    setContacts(c=>c.filter(x=>x.id!==id));
  };

  const setPrimary = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', user.id);
    await supabase.from('emergency_contacts').update({ is_primary: true }).eq('id', id);
    setContacts(c=>c.map(x=>({...x, is_primary: x.id===id})));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Emergency Contacts</span>
          </Link>
          <button
            onClick={() => setShowAddContact(true)}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium !rounded-button"
          >
            Add Contact
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Info Banner */}
        <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
              <i className="ri-alarm-warning-line text-white text-sm"></i>
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-1">Emergency Contacts</h3>
              <p className="text-sm text-red-700">
                These contacts will be notified if you use the emergency button or in case of safety incidents during your trips.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts List */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Your Emergency Contacts</h3>
          </div>
          
          {loading ? <div className='p-4 text-sm text-gray-500'>Loading...</div> : contacts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.is_primary && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Primary
                        </span>
                      )}
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`tel:${contact.phone}`} className="flex-1">
                      <button className="w-full py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium !rounded-button">
                        <i className="ri-phone-line mr-1"></i>
                        Call
                      </button>
                    </Link>
                    {!contact.is_primary && (
                      <button
                        onClick={() => setPrimary(contact.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium !rounded-button"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-gray-400 text-2xl"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No Emergency Contacts</h3>
              <p className="text-gray-600 mb-4">Add trusted contacts who can be reached in emergencies</p>
              <button
                onClick={() => setShowAddContact(true)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium !rounded-button"
              >
                Add First Contact
              </button>
            </div>
          )}
        </div>

        {/* Quick Emergency Actions */}
        <div className="bg-white rounded-2xl shadow-md mt-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Emergency Services</h3>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-3">
            <Link href="tel:10111" className="block">
              <div className="p-3 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-police-car-line text-white"></i>
                </div>
                <p className="font-medium text-gray-900 text-sm">Police</p>
                <p className="text-xs text-gray-600">10111</p>
              </div>
            </Link>

            <Link href="tel:10177" className="block">
              <div className="p-3 bg-red-50 rounded-xl text-center hover:bg-red-100 transition-colors">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-ambulance-line text-white"></i>
                </div>
                <p className="font-medium text-gray-900 text-sm">Ambulance</p>
                <p className="text-xs text-gray-600">10177</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Emergency Contact</h3>
              <button
                onClick={() => setShowAddContact(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                >
                  <option value="">Select relationship</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+27 81 234 5678"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={addContact}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium !rounded-button"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}