"use client";

// US/UK market switcher (spec section 1): sets a cookie the server reads.
export function CountrySelect({ current }: { current: "US" | "GB" }) {
  function choose(next: "US" | "GB") {
    document.cookie = `omni-market=${next}; max-age=31536000; path=/; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="glass rounded-lg overflow-hidden flex text-sm" role="group" aria-label="Select market">
      <button
        onClick={() => choose("US")}
        aria-pressed={current === "US"}
        className={`px-3 py-2 ${current === "US" ? "bg-brand-600" : "hover:bg-white/10"}`}
      >
        US
      </button>
      <button
        onClick={() => choose("GB")}
        aria-pressed={current === "GB"}
        className={`px-3 py-2 ${current === "GB" ? "bg-brand-600" : "hover:bg-white/10"}`}
      >
        UK
      </button>
    </div>
  );
}
