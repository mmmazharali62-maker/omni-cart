// Refund confirmation email (spec section 29).
export function renderRefundIssued(data: {
  orderNumber: string;
  amount: string;
  method: string;
  reason?: string;
}) {
  return {
    subject: `Refund issued - ${data.orderNumber}`,
    body: `We've refunded ${data.amount} to your ${data.method}.${data.reason ? `\nReason: ${data.reason}` : ""}\nThe refund usually appears within 5-10 business days depending on your bank.`
  };
}
