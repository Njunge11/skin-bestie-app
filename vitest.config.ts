import { defineConfig } from "vitest/config";
import path from "path";
import { config } from "dotenv";
import react from "@vitejs/plugin-react";

// Load environment variables from .env file
config();

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts", "./src/test/setup-rtl.ts"],
    pool: "forks", // Use process forks for better isolation and parallelization
    poolOptions: {
      forks: {
        singleFork: false, // Allow multiple forks for parallel execution
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
