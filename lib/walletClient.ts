import { supabase } from './supabase';

function functionsBase(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return url.replace('.supabase.co', `.functions.supabase.co/${path}`);
}

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function callPayments(payload: any) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(await authHeader()) } as any;
  const res = await fetch(functionsBase('payments'), { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface WalletSummary { balance: number; total_topups: number; total_spent: number; }
export interface TransactionRow { id: string; user_id: string; wallet_id?: string; booking_id?: string; transaction_type: string; amount: number; description: string; payment_method?: string; reference_number?: string; status: string; created_at: string; type?: string; // optional legacy alias
  driver?: string; method?: string; receipt?: string; date?: string; time?: string; }

export async function getWallet() : Promise<WalletSummary | null> {
  const { wallet } = await callPayments({ action: 'get_wallet_balance' });
  return wallet || null;
}

export async function getTransactions() : Promise<TransactionRow[]> {
  const { transactions } = await callPayments({ action: 'get_transactions' });
  return transactions;
}

export async function topUp(amount: number, paymentMethod: 'card'|'bank'|'mobile') {
  return callPayments({ action: 'top_up_wallet', amount, paymentMethod });
}

export async function transfer(recipient: string, amount: number, note?: string) {
  return callPayments({ action: 'wallet_transfer', recipient, amount, note });
}
