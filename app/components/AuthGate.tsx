'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const baseSchema = {
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email(),
  phone: z.string().min(8, 'Phone too short'),
  password: z.string().min(6, 'Min 6 chars'),
  idNumber: z.string().min(5, 'ID number required'),
  address: z.string().min(5, 'Address required'),
  dateOfBirth: z.string().min(4, 'DOB required'),
  gender: z.string().optional()
};

const commuterSchema = z.object({ ...baseSchema });

const driverSchema = commuterSchema.extend({
  vehicleMake: z.string().min(2, 'Vehicle make'),
  vehicleModel: z.string().min(1, 'Model'),
  vehicleYear: z.string().min(2, 'Year'),
  licensePlate: z.string().min(3, 'Plate'),
  licenseNumber: z.string().min(4, 'License number'),
  capacity: z.string().optional()
});

interface AuthGateProps {
  userType: 'commuter' | 'driver';
  onAuthenticated?: (user: any, profile?: any) => void;
}

const fieldClasses = 'w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition';

export default function AuthGate({ userType, onAuthenticated }: AuthGateProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [message, setMessage] = useState<string>('');

  const initialState: Record<string,string> = {
    fullName: '', email: '', phone: '', password: '', idNumber: '', address: '', dateOfBirth: '', gender: ''
  };
  if (userType === 'driver') Object.assign(initialState, { vehicleMake:'', vehicleModel:'', vehicleYear:'', licensePlate:'', licenseNumber:'', capacity:'' });
  const [form, setForm] = useState<Record<string,string>>(initialState);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionUser(data.session.user);
        onAuthenticated?.(data.session.user);
      }
      setLoading(false);
    })();
  }, [onAuthenticated]);

  async function handleRegister() {
    setSubmitting(true); setErrors({}); setMessage('');
    const schema = userType === 'driver' ? driverSchema : commuterSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErr: Record<string,string> = {};
      parsed.error.issues.forEach(i => fieldErr[i.path[0] as string] = i.message);
      setErrors(fieldErr); setSubmitting(false); return;
    }

    const meta: Record<string, any> = {
      full_name: form.fullName,
      phone: form.phone,
      user_type: userType
    };
    if (userType === 'driver') meta.vehicle_make = form.vehicleMake;

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: meta }
    });
    if (error) { setMessage(error.message); setSubmitting(false); return; }

    // Insert profile row (best-effort)
    if (signUpData.user) {
      const profilePayload: Record<string, any> = {
        id: signUpData.user.id,
        email: form.email,
        phone: form.phone,
        full_name: form.fullName,
        user_type: userType,
        id_number: form.idNumber,
        address: form.address,
        date_of_birth: form.dateOfBirth,
        gender: form.gender
      };
      try { await supabase.from('users').insert(profilePayload); } catch {}
      if (userType === 'driver') {
        try { await supabase.from('drivers').insert({
          user_id: signUpData.user.id,
          license_number: form.licenseNumber,
            vehicle_make: form.vehicleMake,
            vehicle_model: form.vehicleModel,
            vehicle_year: form.vehicleYear,
            license_plate: form.licensePlate,
            vehicle_capacity: form.capacity ? Number(form.capacity) : 16
          }); } catch {}
      }
    }
    setMessage('Registration successful. Please verify email if required, then login.');
    setMode('login');
    setSubmitting(false);
  }

  async function handleLogin() {
    setSubmitting(true); setErrors({}); setMessage('');
    if (!form.email || !form.password) { setMessage('Email and password are required'); setSubmitting(false); return; }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project.supabase.co')) {
      setMessage('Supabase not configured.'); setSubmitting(false); return; }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setMessage(error.message); setSubmitting(false); return; }
      const authed = data.user;
      // Check user_type from metadata first
      let metaType = authed?.user_metadata?.user_type as string | undefined;
      if (!metaType) {
        // fallback query users table
        const { data: profileRow } = await supabase.from('users').select('user_type').eq('id', authed.id).single();
        metaType = profileRow?.user_type;
      }
      if (metaType && metaType !== userType) {
        // Wrong portal
        await supabase.auth.signOut();
        setMessage(`This account is registered as ${metaType}. Please use the ${metaType === 'driver' ? 'driver' : 'commuter'} login.`);
        setSubmitting(false);
        return;
      }
      setSessionUser(authed);
      onAuthenticated?.(authed);
    } catch (e:any) {
      setMessage('Network error connecting to authentication service.');
    } finally { setSubmitting(false); }
  }

  function updateField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  if (loading) return <div className='pt-32 text-center text-gray-600'>Loading...</div>;
  if (sessionUser) return null; // Parent renders app content

  const commonFields = (
    <>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
        <input value={form.fullName} onChange={e=>updateField('fullName', e.target.value)} className={fieldClasses} />
        {errors.fullName && <p className='text-xs text-red-600 mt-1'>{errors.fullName}</p>}
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
          <input type='email' value={form.email} onChange={e=>updateField('email', e.target.value)} className={fieldClasses} />
          {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
          <input value={form.phone} onChange={e=>updateField('phone', e.target.value)} className={fieldClasses} />
          {errors.phone && <p className='text-xs text-red-600 mt-1'>{errors.phone}</p>}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
          <input type='password' value={form.password} onChange={e=>updateField('password', e.target.value)} className={fieldClasses} />
          {errors.password && <p className='text-xs text-red-600 mt-1'>{errors.password}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>ID Number</label>
          <input value={form.idNumber} onChange={e=>updateField('idNumber', e.target.value)} className={fieldClasses} />
          {errors.idNumber && <p className='text-xs text-red-600 mt-1'>{errors.idNumber}</p>}
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
        <input value={form.address} onChange={e=>updateField('address', e.target.value)} className={fieldClasses} />
        {errors.address && <p className='text-xs text-red-600 mt-1'>{errors.address}</p>}
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Date of Birth</label>
          <input type='date' value={form.dateOfBirth} onChange={e=>updateField('dateOfBirth', e.target.value)} className={fieldClasses} />
          {errors.dateOfBirth && <p className='text-xs text-red-600 mt-1'>{errors.dateOfBirth}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Gender</label>
          <select value={form.gender} onChange={e=>updateField('gender', e.target.value)} className={fieldClasses}>
            <option value=''>Select</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
        </div>
      </div>
    </>
  );

  const driverExtra = userType === 'driver' && (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Vehicle Make</label>
          <input value={form.vehicleMake} onChange={e=>updateField('vehicleMake', e.target.value)} className={fieldClasses} />
          {errors.vehicleMake && <p className='text-xs text-red-600 mt-1'>{errors.vehicleMake}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Model</label>
          <input value={form.vehicleModel} onChange={e=>updateField('vehicleModel', e.target.value)} className={fieldClasses} />
          {errors.vehicleModel && <p className='text-xs text-red-600 mt-1'>{errors.vehicleModel}</p>}
        </div>
      </div>
      <div className='grid grid-cols-3 gap-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Year</label>
          <input value={form.vehicleYear} onChange={e=>updateField('vehicleYear', e.target.value)} className={fieldClasses} />
          {errors.vehicleYear && <p className='text-xs text-red-600 mt-1'>{errors.vehicleYear}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Plate</label>
          <input value={form.licensePlate} onChange={e=>updateField('licensePlate', e.target.value)} className={fieldClasses} />
          {errors.licensePlate && <p className='text-xs text-red-600 mt-1'>{errors.licensePlate}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Seats</label>
          <input value={form.capacity} onChange={e=>updateField('capacity', e.target.value)} className={fieldClasses} placeholder='16' />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Driver License No.</label>
        <input value={form.licenseNumber} onChange={e=>updateField('licenseNumber', e.target.value)} className={fieldClasses} />
        {errors.licenseNumber && <p className='text-xs text-red-600 mt-1'>{errors.licenseNumber}</p>}
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col'>
      <header className='px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold'>TC</div>
          <h1 className='font-pacifico text-xl text-orange-600'>SA Taxi Connect</h1>
        </div>
        <button onClick={()=>setMode(m => m==='login'?'register':'login')} className='text-sm text-orange-600 font-medium'>
          {mode === 'login' ? 'Create account' : 'Have an account? Login'}
        </button>
      </header>
      <main className='flex-1 px-5 pb-24'>
        <div className='max-w-md mx-auto bg-white rounded-3xl shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-1 text-center'>
            {mode === 'login' ? `${userType === 'driver' ? 'Driver' : 'Commuter'} Login` : `${userType === 'driver' ? 'Driver Registration' : 'Commuter Sign Up'}`}
          </h2>
          <p className='text-center text-gray-600 text-sm mb-6'>
            {mode === 'login' ? 'Access your account securely' : userType === 'driver' ? 'Provide your vehicle & license details for verification' : 'Provide your personal details for secure travel'}
          </p>

          {mode === 'register' && (
            <div className='space-y-4'>
              {commonFields}
              {driverExtra}
            </div>
          )}

          {mode === 'login' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input type='email' value={form.email} onChange={e=>updateField('email', e.target.value)} className={fieldClasses} />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                <input type='password' value={form.password} onChange={e=>updateField('password', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          )}

          {message && <div className='mt-4 text-sm text-center text-orange-600'>{message}</div>}

          <button
            disabled={submitting}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-md transition-colors ${submitting ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </div>
      </main>
    </div>
  );
}
