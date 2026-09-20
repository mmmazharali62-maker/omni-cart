import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Uniform API error handling (spec section 26: error handling).
// Never leaks internal errors to clients in production.
export function apiError(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: err.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  const isProduction = process.env.NODE_ENV === "production";
  console.error("[api]", err);
  return NextResponse.json(
    { error: isProduction ? "Something went wrong" : message },
    { status: 500 }
  );
}
