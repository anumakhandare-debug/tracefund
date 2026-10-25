import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Sabhi campaigns ki list fetch karein
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Nayi campaign create karein
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, goal_amount, creator_id } = body;

    if (!title || !goal_amount) {
      return NextResponse.json(
        { success: false, error: 'Title and goal amount are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ title, description, goal_amount, creator_id, raised_amount: 0 }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
