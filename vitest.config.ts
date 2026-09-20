import { defineConfig } from "vitest/config";
import path from "path";

// Vitest config: resolve the repo's @/ alias and run unit tests only.
export default defineConfig({
  test: { include: ["test/**/*.test.ts"], environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
});
