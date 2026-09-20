import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(clientKey(req, "register"), 10, 60 * 60_000); // 10/hour per IP
    if (!rl.allowed) return NextResponse.json({ error: "Too many attempts, try later" }, { status: 429 });

    const { name, email, password } = registerSchema.parse(await req.json());

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, role: "CUSTOMER" }
    });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    return apiError(err);
  }
}
