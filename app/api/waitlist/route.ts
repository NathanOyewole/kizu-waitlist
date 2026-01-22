import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

// 1. Prisma Singleton (Prevents connection limit errors in development)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 2. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 3. Save to Database
    try {
      await prisma.lead.create({ data: { email } });
    } catch (e) {
      // Prisma error code P2002 means unique constraint violation (duplicate)
      return NextResponse.json({ message: "You're already on the list, boss." });
    }

    // 4. Send the "Hook Mail" (Only runs if DB save was successful)
    try {
      await resend.emails.send({
        // ⚠️ IMPORTANT: If you haven't verified 'kizu.app' on Resend yet, 
        // change this to 'onboarding@resend.dev' to test.
        from: 'Kizu <onboarding@resend.dev>',
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
      console.error("Email failed to send:", emailError);
      // We log the error but don't stop the user flow.
    }

    return NextResponse.json({ message: "Access requested. Check your inbox." });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
