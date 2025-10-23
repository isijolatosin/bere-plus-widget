// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // ✅ Include demo page
      },
      output: {
        entryFileNames: "bere-plus-widget.umd.js",
        assetFileNames: "bere-plus-widget.[ext]",
        format: "umd",
        name: "BerePlusWidget",
      },
    },
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "BerePlusWidget",
      fileName: (format) => `bere-plus-widget.${format}.js`, // <- dynamic extension
      formats: ["umd"], // make it embeddable
    },
    minify: "esbuild", // ensure minification
  },
  server: {
    open: true, // auto-open index.html
    proxy: {
      "/api": {
        target: "https://bere-plus.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
