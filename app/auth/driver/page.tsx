'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGate from '../../components/AuthGate';
import { supabase } from '../../../lib/supabase';

export default function DriverAuthPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) router.replace('/driver');
    })();
    return () => { active = false; };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-orange-50 px-4 py-24">
      <div className="mb-8 flex flex-col items-center">
        <img src="/Logo.png" alt="SA Taxi Connect Logo" className="h-16 w-16 rounded-2xl object-contain mb-3 shadow" />
        <h1 className="font-pacifico text-2xl text-orange-600">SA Taxi Connect</h1>
      </div>
      <div className="w-full max-w-xl">
        <AuthGate userType="driver" onAuthenticated={() => router.replace('/driver')} />
      </div>
    </div>
  );
}
