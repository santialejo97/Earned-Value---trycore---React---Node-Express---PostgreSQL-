/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/auth/actions/**/*.ts",
        "src/auth/store/**/*.ts",
        "src/project/actions/**/*.ts",
        "src/project/hooks/**/*.{ts,tsx}",
        "src/project/utils/**/*.ts",
        "src/project/components/**/*.{ts,tsx}",
        "src/components/routes/**/*.{ts,tsx}",
        "src/hooks/**/*.ts",
        "src/api/**/*.ts",
        "src/type/**/*.ts",
      ],
      exclude: [
        "src/main.tsx",
        "src/EarnedApp.tsx",
        "src/**/*.d.ts",
        "src/components/ui/**",
        "src/router/**",
        "src/test/**",
        "src/auth/pages/**",
        "src/auth/layouts/**",
        "src/project/pages/**",
        "src/project/layouts/**",
        "src/components/providers/**",
        "src/components/theme-provider.tsx",
        "src/project/components/CustomerInfoEarned.tsx",
        "src/project/components/CustomerModalDelete.tsx",
      ],
    },
  },
});
