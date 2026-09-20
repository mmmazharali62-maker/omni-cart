// Password strength scoring (spec section 17). Score 0-4; >=3 recommended.
export function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export function passwordFeedback(pw: string): string[] {
  const tips: string[] = [];
  if (pw.length < 8) tips.push("Use at least 8 characters");
  if (!/[A-Z]/.test(pw)) tips.push("Add an uppercase letter");
  if (!/\d/.test(pw)) tips.push("Add a number");
  if (!/[^A-Za-z0-9]/.test(pw)) tips.push("Add a symbol");
  return tips;
}
