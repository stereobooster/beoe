import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    wasm(), topLevelAwait(),
  ],
  optimizeDeps: {
    exclude: [
      "@vizdom/vizdom-ts-esm"
    ]
  },
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
