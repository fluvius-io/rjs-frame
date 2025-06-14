import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        // Remove '/api' prefix when forwarding to backend
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RjsAdmin",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "rjs-frame",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          "rjs-frame": "RjsFrame",
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
