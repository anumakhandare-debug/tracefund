import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Chain ya ledger records fetch karne ke liye
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tracefund_records')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Naya chain block / record add karne ke liye
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaign_id, donor_name, amount, previous_hash, current_hash } = body;

    if (!campaign_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID and amount are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tracefund_records')
      .insert([
        {
          campaign_id,
          donor_name: donor_name || 'Anonymous',
          amount,
          previous_hash,
          current_hash,
          date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
