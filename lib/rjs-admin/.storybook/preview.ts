import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';
import React from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#09090b',
        },
      ],
    },
  },
  decorators: [
    (Story) => 
      React.createElement(
        'div', 
        { className: 'min-h-screen bg-background text-foreground p-4' },
        React.createElement(Story)
      ),
  ],
};

export default preview; 