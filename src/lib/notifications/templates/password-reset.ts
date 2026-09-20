// Password reset email (spec section 17). The token comes from NextAuth's flow.
export function renderPasswordReset(data: { resetUrl: string; expiresInMinutes?: number }) {
  const mins = data.expiresInMinutes ?? 60;
  return {
    subject: "Reset your Omni Cart password",
    body: `Someone (hopefully you) requested a password reset. Open this link to set a new password: ${data.resetUrl}. This link expires in ${mins} minutes. If you didn't request it, you can safely ignore this email.`
  };
}
