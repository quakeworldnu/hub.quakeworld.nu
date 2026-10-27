import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve("./index.html"),
        demoPlayer: resolve("./demo-player/index.html"),
        games: resolve("./games/index.html"),
        players: resolve("./players/index.html"),
        qtv: resolve("./qtv/index.html"),
        scoreboard: resolve("./scoreboard/index.html"),
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  // in-source tests (import.meta.vitest) are removed from production builds
  define: {
    "import.meta.vitest": "undefined",
  },
  test: {
    includeSource: ["src/**/*.{ts,tsx}"],
  },
});
