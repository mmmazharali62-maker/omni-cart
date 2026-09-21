"use client";

// Download an order receipt as a text file (spec section 8).
export function ReceiptDownload({ orderNumber, receiptText }: { orderNumber: string; receiptText: string }) {
  function download() {
    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omnicart-receipt-${orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={download} className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10">
      Download receipt
    </button>
  );
}
