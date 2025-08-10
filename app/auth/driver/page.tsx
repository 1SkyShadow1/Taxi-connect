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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-orange-50 px-4 py-24">
      <div className="w-full max-w-xl">
        <AuthGate userType="driver" onAuthenticated={() => router.replace('/driver')} />
      </div>
    </div>
  );
}
