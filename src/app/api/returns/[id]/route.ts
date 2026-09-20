import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fetch one return request (owner or admin only).
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;

  const request = await db.returnRequest.findUnique({ where: { id: params.id } }).catch(() => null);
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = user?.role && ["ADMIN", "SUPPORT", "STORE_MANAGER"].includes(user.role);
  const isOwner = user?.id && request.userId === user.id;
  if (!isAdmin && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(request);
}

// Customer cancels their own pending request.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const request = await db.returnRequest.findUnique({ where: { id: params.id } }).catch(() => null);
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (request.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (request.status !== "requested") return NextResponse.json({ error: "Only pending requests can be cancelled" }, { status: 400 });

  await db.returnRequest.update({ where: { id: params.id }, data: { status: "cancelled" } });
  return NextResponse.json({ ok: true });
}
