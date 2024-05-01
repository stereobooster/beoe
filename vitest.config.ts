import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    exclude: ["**/vendor/**", "**/node_modules/**", "**/experiments/**"],
    coverage: {
      provider: "v8",
      include: ["**/packages/*/src/**/*.ts"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/scripts/**"],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
