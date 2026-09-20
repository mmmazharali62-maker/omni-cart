"use client";

import { Spinner } from "@/components/ui/spinner";

// Sticky save/clear bar shown when a form has changes pending.
export function SaveBar({
  saving,
  onSave,
  onClear
}: {
  saving: boolean;
  onSave: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="sticky bottom-4 flex gap-2 justify-end mt-6">
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="glass px-4 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10"
        >
          Clear saved keys
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
      >
        {saving && <Spinner size={14} />} {saving ? "Saving..." : "Save credentials"}
      </button>
    </div>
  );
}
