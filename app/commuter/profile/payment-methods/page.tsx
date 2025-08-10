'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getWallet, WalletSummary } from '@/lib/walletClient';

interface PaymentMethodRow { id: string; type: string; name: string; details?: string; is_primary?: boolean; }

export default function PaymentMethodsPage() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [methods, setMethods] = useState<PaymentMethodRow[]>([]); // future dynamic fetch
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth/commuter'; return; }
      const userType = user.user_metadata?.user_type;
      if (userType && userType !== 'commuter') { window.location.href = '/'; return; }
      try {
        const w = await getWallet();
        setWallet(w);
        // Placeholder now removed: do not show fake card/mobile. Load from payment_methods table if exists
        const { data: pm } = await supabase.from('payment_methods').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        if (pm) {
          setMethods(pm.map((m:any)=>({ id: m.id, type: m.type, name: m.brand || m.type, details: m.masked_identifier, is_primary: m.is_primary })));
        }
      } catch(e) { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const setPrimary = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Unset others then set selected
    await supabase.from('payment_methods').update({ is_primary: false }).eq('user_id', user.id);
    await supabase.from('payment_methods').update({ is_primary: true }).eq('id', id).eq('user_id', user.id);
    setMethods(ms => ms.map(m => ({ ...m, is_primary: m.id === id })));
  };

  const removeMethod = async (id: string) => {
    await supabase.from('payment_methods').delete().eq('id', id);
    setMethods(ms => ms.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Payment Methods</span>
          </Link>
        </div>
      </header>
      <main className="pt-16 pb-20 px-4">
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Wallet</h3>
          </div>
          <div className="p-4">
            {loading ? <p className='text-sm text-gray-500'>Loading...</p> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900" suppressHydrationWarning>R{(wallet?.balance || 0).toFixed(2)}</p>
                </div>
                <Link href="/commuter/wallet" className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium !rounded-button">Open Wallet</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Linked Payment Methods</h3>
            <span className='text-xs text-gray-500'>{methods.length} linked</span>
          </div>
          {methods.length === 0 && !loading && (
            <div className='p-6 text-center text-sm text-gray-500'>No payment methods linked yet.</div>
          )}
          <div className="divide-y divide-gray-100">
            {methods.map(m => (
              <div key={m.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.details}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {m.is_primary && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Primary</span>}
                    <button onClick={() => removeMethod(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><i className="ri-delete-bin-line text-sm"/></button>
                  </div>
                </div>
                {!m.is_primary && (
                  <button onClick={()=>setPrimary(m.id)} className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium !rounded-button">Set Primary</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 shadow-md border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <i className="ri-shield-check-line text-white text-sm"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Security</h4>
              <p className="text-sm text-blue-700">Your wallet and payment methods are encrypted. No sensitive card numbers are stored.</p>
            </div>
          </div>
        </div>
      </main>
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/commuter" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-home-line text-gray-400 text-lg"/></div><span className="text-xs text-gray-400 mt-1">Home</span></Link>
          <Link href="/commuter/trips" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-route-line text-gray-400 text-lg"/></div><span className="text-xs text-gray-400 mt-1">My Trips</span></Link>
          <Link href="/commuter/wallet" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-wallet-line text-gray-400 text-lg"/></div><span className="text-xs text-gray-400 mt-1">Wallet</span></Link>
          <Link href="/commuter/profile" className="flex flex-col items-center py-2 px-1"><div className="w-6 h-6 flex items-center justify-center"><i className="ri-user-line text-orange-500 text-lg"/></div><span className="text-xs text-orange-500 font-medium mt-1">Profile</span></Link>
        </div>
      </nav>
    </div>
  );
}