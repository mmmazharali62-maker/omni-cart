import type { Config } from "tailwindcss";

// Liquid Glass + premium 3D ecommerce design tokens for Omni Cart.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.14)",
          highlight: "rgba(255,255,255,0.25)"
        },
        brand: {
          50: "#eef4ff",
          200: "#b9d3ff",
          400: "#5a8dff",
          600: "#2f5fe0",
          800: "#1c3aa0"
        }
      },
      backdropBlur: { glass: "18px" },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.18)",
        "glass-inset": "inset 0 1px 0 rgba(255,255,255,0.25)"
      },
      borderRadius: { glass: "20px" }
    }
  },
  plugins: []
};
export default config;
