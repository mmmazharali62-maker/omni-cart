import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { needsModeration, rankQuestions } from "@/lib/qa";

const askSchema = z.object({
  productId: z.string().min(3),
  email: z.string().email(),
  question: z.string().min(10).max(500)
});

// Product Q&A (spec section 7): ask publicly, answer once, publish after review.
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const questions = await db.qaQuestion.findMany({
    where: { productId, isPublished: true },
    take: 50
  }).catch(() => []);

  const ranked = rankQuestions(questions.map((q) => ({
    id: q.id, question: q.question, answer: q.answer,
    helpfulCount: q.helpfulCount, isPublished: q.isPublished
  })));
  return NextResponse.json({ questions: ranked });
}

export async function POST(req: NextRequest) {
  try {
    const body = askSchema.parse(await req.json());
    if (needsModeration({ question: body.question })) {
      // Accept but never publish without human review.
      const q = await db.qaQuestion.create({
        data: { productId: body.productId, askerEmail: body.email.toLowerCase(), question: body.question, isPublished: false }
      });
      return NextResponse.json({ id: q.id, status: "in_moderation" }, { status: 201 });
    }
    const q = await db.qaQuestion.create({
      data: { productId: body.productId, askerEmail: body.email.toLowerCase(), question: body.question, isPublished: false }
    });
    return NextResponse.json({ id: q.id, status: "pending_answer" }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}
