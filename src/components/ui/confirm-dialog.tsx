"use client";

import { useState } from "react";

// Confirmation dialog for destructive actions (spec section 14/17).
export function ConfirmDialog({
  label,
  title,
  description,
  confirmText = "Confirm",
  onConfirm,
  danger = true
}: {
  label: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm">{label}</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="glass p-6 max-w-sm w-full">
            <h3 className="font-semibold">{title}</h3>
            {description && <p className="text-sm text-white/60 mt-2">{description}</p>}
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setOpen(false)} className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10">Cancel</button>
              <button
                disabled={busy}
                onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); setOpen(false); }}
                className={`px-4 py-2 rounded-lg text-sm disabled:opacity-50 ${danger ? "bg-red-600 text-white" : "bg-brand-600 text-white"}`}
              >
                {busy ? "Working..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
