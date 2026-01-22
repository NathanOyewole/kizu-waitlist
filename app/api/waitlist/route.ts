import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Global instance to prevent connection limits in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    try {
      await prisma.lead.create({ data: { email } });
      return NextResponse.json({ message: "You're on the list." });
    } catch (e) {
      // P2002 is Prisma code for unique constraint violation (duplicate email)
      return NextResponse.json({ message: "You're already on the list." });
    }

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
