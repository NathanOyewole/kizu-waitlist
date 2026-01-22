import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { Resend } from "resend";

// Initialize Supabase (Admin access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Save to Supabase
    // We assume your table is named 'Lead' and has an 'email' column
    const { error: dbError } = await supabase
      .from('Lead')
      .insert([{ email }]);

    if (dbError) {
      // code '23505' is Postgres for "Unique Violation" (Duplicate)
      if (dbError.code === '23505') {
        return NextResponse.json({ message: "You're already on the list, boss." });
      }
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // 2. Send the "Hook Mail"
    try {
      await resend.emails.send({
        from: 'Kizu <onboarding@resend.dev>', // Change to 'onboarding@resend.dev' if testing
        to: email,
        subject: 'Your Access to Kizu',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <p>Hey,</p>
            <p>Kizu is almost ready.</p>
            <p>We're planning to launch at <strong>$49/month</strong>, but since you're an early supporter, I'm locking you in for <strong>$19/month</strong> if you reply to this email.</p>
            <p>I'm building this to solve my own pain of manual research. I'd love to hear what you are building.</p>
            <br/>
            <p>Cheers,</p>
            <p>bola.<br/>Founder, Kizu</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    return NextResponse.json({ message: "Access requested. Check your inbox." });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
