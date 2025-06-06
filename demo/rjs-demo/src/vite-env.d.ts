/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_DEBUG?: string;
  readonly VITE_DEBUG_MODE?: string;
  readonly VITE_XRAY_MODE?: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 