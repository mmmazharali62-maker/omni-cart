"use client";

import { useState } from "react";

// Credential input: password-masked by default, with show/hide toggle.
export function SecretField({
  name,
  label,
  required,
  placeholder,
  help,
  type = "secret",
  options,
  defaultValue
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  type?: "secret" | "text" | "select";
  options?: string[];
  defaultValue?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="text-sm text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {type === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
        >
          {(options ?? []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <span className="flex mt-1">
          <input
            name={name}
            type={type === "secret" && !show ? "password" : "text"}
            placeholder={placeholder}
            defaultValue={defaultValue}
            autoComplete="off"
            className="w-full glass bg-white/5 px-3 py-2 rounded-l-lg text-sm outline-none font-mono"
          />
          {type === "secret" && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide value" : "Show value"}
              className="glass bg-white/5 px-3 rounded-r-lg text-xs text-white/60 hover:text-white"
            >
              {show ? "Hide" : "Show"}
            </button>
          )}
        </span>
      )}
      {help && <span className="block text-xs text-white/40 mt-1">{help}</span>}
    </label>
  );
}
