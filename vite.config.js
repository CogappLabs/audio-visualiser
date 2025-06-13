import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "p5/lib/addons/p5.sound": "p5/lib/addons/p5.sound.js",
    },
  },
});
