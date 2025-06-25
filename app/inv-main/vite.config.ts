import react from "@vitejs/plugin-react";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          APP_NAME: "Invest Mate",
        },
        tags: [
          {
            injectTo: "head",
            tag: "style",
            children: fs.readFileSync(
              "../../lib/rjs-frame/src/styles/static.css",
              "utf-8"
            ),
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,
    watch: {
      // Watch for changes in lib directories (parent folder)
      ignored: ["!**/../../lib/rjs-frame/**"],
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        headers: {
          Host: "app.invest-mate.net",
        },
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // 1MB, adjust as needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "rvd";
            if (id.includes("@radix-ui")) return "rdu";
            if (id.includes("lucide-react")) return "icx";
            if (id.includes("tailwindcss")) return "tld";
            return "other";
          }
          if (id.includes("/src/components/")) return "com";
          if (id.includes("/src/pages/")) return "pages";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
