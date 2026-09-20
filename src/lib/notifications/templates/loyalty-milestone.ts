// Loyalty tier upgrade email (spec section 15).
export function renderLoyaltyMilestone(data: { tier: string; perks: string[]; points: number }) {
  const perks = data.perks.map((p) => `- ${p}`).join("\n");
  return {
    subject: `You've reached ${data.tier} status`,
    body: `Congratulations - you're now ${data.tier} with ${data.points} points!\n\nYour perks:\n${perks}\n\nThanks for being a loyal customer.`
  };
}
