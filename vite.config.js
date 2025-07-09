import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath, URL } from "url";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "p5/lib/addons/p5.sound": "p5/lib/addons/p5.sound.js",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "index.html"
        ),
      },
    },
  },
  // For gh-pages - only set base in production
  base: command === "build" ? "/audio-visualiser" : "/",
}));
