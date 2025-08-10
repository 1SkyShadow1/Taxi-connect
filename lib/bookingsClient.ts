import { supabase } from './supabase';

function getFunctionsBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!url) return '';
  return url.replace('.supabase.co', '.functions.supabase.co');
}

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function bookingsFunction<T=any>(payload: Record<string, any>): Promise<T> {
  const base = getFunctionsBaseUrl();
  if (!base) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(await getAuthHeader()) } as any;
  const res = await fetch(`${base}/bookings`, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed ${res.status}`);
  }
  return res.json();
}

export interface BookingRow {
  id: string;
  commuter_id: string;
  driver_id: string | null;
  pickup_location: string;
  destination_location: string;
  passenger_count: number;
  booking_type: string;
  scheduled_time: string | null;
  fare_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_time?: string | null;
  completion_time?: string | null;
  driver?: { full_name: string; phone?: string } | null;
  commuter?: { full_name: string; phone?: string } | null;
}

export async function getUserBookings(): Promise<BookingRow[]> {
  const { bookings } = await bookingsFunction<{ bookings: BookingRow[] }>({ action: 'get_bookings' });
  return bookings;
}

export async function getDriverRequests(): Promise<BookingRow[]> {
  const { requests } = await bookingsFunction<{ requests: BookingRow[] }>({ action: 'get_driver_requests' });
  return requests;
}

export async function acceptBooking(bookingId: string) {
  return bookingsFunction({ action: 'accept_booking', bookingId });
}
