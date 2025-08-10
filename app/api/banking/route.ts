import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const accountSchema = z.object({
  bankCode: z.string().min(2),
  branchCode: z.string().min(3),
  accountNumber: z.string().min(6).max(20),
  accountType: z.enum(['Savings','Cheque','Current']),
  accountHolder: z.string().min(2),
  isPrimary: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = accountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
    }

    const encrypted = parsed.data.accountNumber; // TODO: integrate encryption/KMS

    if (parsed.data.isPrimary) {
      await supabase.from('bank_accounts').update({ is_primary: false }).eq('user_id', userId);
    }

    const { error } = await supabase.from('bank_accounts').insert({
      user_id: userId,
      bank_code: parsed.data.bankCode,
      branch_code: parsed.data.branchCode,
      account_number_encrypted: encrypted,
      account_type: parsed.data.accountType,
      account_holder: parsed.data.accountHolder,
      is_primary: parsed.data.isPrimary || false,
      status: 'pending'
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  let userId: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { data } = await supabase.auth.getUser(token);
    userId = data.user?.id || null;
  }
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('bank_accounts').select('*').eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ accounts: data });
}
