// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/main.jsx",
      name: "BerePlusWidget",
      fileName: (format) => `bere-plus-widget.${format}.js`, // <- dynamic extension
      formats: ["umd"], // make it embeddable
    },
    rollupOptions: {
      external: ["react", "react-dom"], // do not bundle
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
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
