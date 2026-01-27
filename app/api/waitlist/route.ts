import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Init Supabase (Server Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, referrer } = await req.json();

    // Call your RPC function
    const { data, error } = await supabase
      .rpc('signup_for_waitlist', {
        p_email: email,
        p_referred_by_code: referrer
      });

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
