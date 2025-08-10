'use client';

import { useState } from 'react';
import Link from 'next/link';
import { transfer, getWallet } from '@/lib/walletClient';

export default function WalletSendPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const [balance, setBalance] = useState<number|null>(null);

  async function refreshBalance() { try { const w = await getWallet(); setBalance(w?.balance || 0); } catch {} }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setSuccess(null);
    const amt = parseFloat(amount);
    if (!recipient.trim()) return setError('Recipient email or phone required');
    if (isNaN(amt) || amt <= 0) return setError('Enter a valid amount');
    setSubmitting(true);
    try {
      await transfer(recipient.trim(), amt, note.trim() || undefined);
      setSuccess('Transfer successful');
      setAmount(''); setNote('');
      await refreshBalance();
    } catch (e:any) { setError(e.message || 'Transfer failed'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='fixed top-0 w-full bg-white shadow-sm z-50'>
        <div className='px-4 py-3 flex items-center justify-between'>
          <Link href='/commuter/wallet' className='flex items-center space-x-2'>
            <i className='ri-arrow-left-line text-gray-600 text-xl'></i>
            <span className='font-semibold text-gray-900'>Send Money</span>
          </Link>
          <button onClick={refreshBalance} className='text-sm text-orange-600 font-medium'>Refresh</button>
        </div>
      </header>
      <main className='pt-16 pb-24 px-4 max-w-md mx-auto'>
        <div className='bg-white rounded-2xl p-5 shadow-md mb-6'>
          <p className='text-sm text-gray-600 mb-1'>Current Balance</p>
          <p className='text-2xl font-bold text-gray-900' suppressHydrationWarning>{balance === null ? '—' : `R${balance.toFixed(2)}`}</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5 bg-white rounded-2xl p-5 shadow-md'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Recipient (email or phone)</label>
            <input value={recipient} onChange={e=>setRecipient(e.target.value)} className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500'/>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Amount (R)</label>
            <input type='number' min='1' step='0.01' value={amount} onChange={e=>setAmount(e.target.value)} className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500'/>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Note (optional)</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} className='w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500'/>
          </div>
          {error && <p className='text-xs text-red-600'>{error}</p>}
          {success && <p className='text-xs text-green-600'>{success}</p>}
          <button disabled={submitting} type='submit' className='w-full py-4 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-50'>
            {submitting ? 'Sending...' : 'Send Funds'}
          </button>
          <p className='text-xs text-gray-500 text-center'>Transfers are instant and cannot be reversed.</p>
        </form>
      </main>
      <nav className='fixed bottom-0 w-full bg-white border-t border-gray-200'>
        <div className='grid grid-cols-4 px-0'>
          <Link href='/commuter' className='flex flex-col items-center py-2 px-1'><i className='ri-home-line text-gray-400 text-lg'></i><span className='text-xs text-gray-400 mt-1'>Home</span></Link>
          <Link href='/commuter/trips' className='flex flex-col items-center py-2 px-1'><i className='ri-route-line text-gray-400 text-lg'></i><span className='text-xs text-gray-400 mt-1'>Trips</span></Link>
          <Link href='/commuter/wallet' className='flex flex-col items-center py-2 px-1'><i className='ri-wallet-line text-orange-500 text-lg'></i><span className='text-xs text-orange-500 font-medium mt-1'>Wallet</span></Link>
          <Link href='/commuter/profile' className='flex flex-col items-center py-2 px-1'><i className='ri-user-line text-gray-400 text-lg'></i><span className='text-xs text-gray-400 mt-1'>Profile</span></Link>
        </div>
      </nav>
    </div>
  );
}
