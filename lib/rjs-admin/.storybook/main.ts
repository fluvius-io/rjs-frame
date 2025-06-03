import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from "node:module";
import path, { dirname, join } from 'path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (config) => {
    // Ensure proper alias resolution
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Add proxy configuration for API calls
    config.server = config.server || {};
    config.server.proxy = {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Remove '/api' prefix when forwarding to backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    };

    return config;
  }
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
} 