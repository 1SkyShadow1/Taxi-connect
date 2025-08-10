'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGate from '../../components/AuthGate';
import { supabase } from '../../../lib/supabase';

export default function CommuterAuthPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) router.replace('/commuter');
    })();
    return () => { active = false; };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-orange-50 to-yellow-50 px-4 py-24">
      <div className="w-full max-w-xl">
        <AuthGate userType="commuter" onAuthenticated={() => router.replace('/commuter')} />
      </div>
    </div>
  );
}
