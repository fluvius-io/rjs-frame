import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
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
