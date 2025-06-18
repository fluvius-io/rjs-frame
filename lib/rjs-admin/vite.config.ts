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
        "@radix-ui/react-checkbox",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-label",
        "@radix-ui/react-select",
        "@radix-ui/react-tabs",
        "@radix-ui/react-avatar",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          "rjs-frame": "RjsFrame",
          "@radix-ui/react-slot": "RadixUISlot",
          "@radix-ui/react-checkbox": "RadixUICheckbox",
          "@radix-ui/react-dialog": "RadixUIDialog",
          "@radix-ui/react-dropdown-menu": "RadixUIDropdownMenu",
          "@radix-ui/react-label": "RadixUILabel",
          "@radix-ui/react-select": "RadixUISelect",
          "@radix-ui/react-tabs": "RadixUITabs",
          "@radix-ui/react-avatar": "RadixUIAvatar",
          "class-variance-authority": "classVarianceAuthority",
          clsx: "clsx",
          "tailwind-merge": "tailwindMerge",
          "lucide-react": "lucideReact",
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
