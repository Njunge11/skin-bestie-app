import { defineConfig } from "vitest/config";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
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
