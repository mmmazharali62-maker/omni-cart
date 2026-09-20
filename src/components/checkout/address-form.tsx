"use client";

import { useState } from "react";

// Address form for checkout (spec section 5): US/GB aware.
export type AddressFormValue = {
  fullName: string; line1: string; line2?: string;
  city: string; state?: string; postalCode: string; country: string;
};

export function AddressForm({
  defaultCountry = "US",
  onChange
}: {
  defaultCountry?: "US" | "GB";
  onChange?: (data: AddressFormValue) => void;
}) {
  const [country, setCountry] = useState<"US" | "GB">(defaultCountry);
  const isUS = country === "US";

  function field(name: string, label: string, extra?: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <label className="block">
        <span className="text-sm text-white/70">{label}</span>
        <input
          name={name}
          required={name !== "line2" && name !== "state"}
          onBlur={() => {
            if (!onChange) return;
            const form = document.querySelector<HTMLFormElement>("[data-address-form]");
            if (!form) return;
            const raw = Object.fromEntries(new FormData(form).entries());
            onChange(raw as AddressFormValue);
          }}
          className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
          {...extra}
        />
      </label>
    );
  }

  return (
    <form className="space-y-3" data-address-form>
      <label className="block">
        <span className="text-sm text-white/70">Country</span>
        <select
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value as "US" | "GB")}
          className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
        >
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
        </select>
      </label>
      {field("fullName", "Full name", { autoComplete: "name" })}
      {field("line1", "Address line 1", { autoComplete: "address-line1" })}
      {field("line2", "Address line 2 (optional)", { autoComplete: "address-line2" })}
      <div className="grid grid-cols-2 gap-3">
        {field("city", "City", { autoComplete: "address-level2" })}
        {isUS
          ? field("state", "State (2-letter)", { maxLength: 2, autoCapitalize: "characters", autoComplete: "address-level1" })
          : field("state", "County (optional)", { autoComplete: "address-level4" })}
      </div>
      {field("postalCode", isUS ? "ZIP code" : "Postcode", {
        autoComplete: isUS ? "postal-code" : "postal-code",
        placeholder: isUS ? "90210" : "SW1A 1AA"
      })}
    </form>
  );
}
