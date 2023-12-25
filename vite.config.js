import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve("./index.html"),
        games: resolve("./games/index.html"),
        players: resolve("./players/index.html"),
        scoreboard: resolve("./scoreboard/index.html"),
      },
    },
  },
  define: {
    "process.env": process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@qwhub": resolve("./src"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
