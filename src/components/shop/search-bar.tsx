"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Header search with live suggestions (spec section 2/9).
export function SearchBar({ placeholder = "Search products..." }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions ?? []);
        }
      } catch { /* ignore */ }
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(q: string) {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); submit(query); }}
        className="flex glass rounded-lg overflow-hidden"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          placeholder={placeholder}
          aria-label="Search products"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <button type="submit" className="px-3 text-white/60 hover:text-white" aria-label="Search">⌕</button>
      </form>
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 w-full glass rounded-lg overflow-hidden z-20">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => submit(s)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 truncate"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
