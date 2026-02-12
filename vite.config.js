import { resolve } from "node:path";
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
        qtvPopout: resolve("./qtv-popout/index.html"),
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
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
