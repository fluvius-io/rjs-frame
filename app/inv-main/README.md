# Invest Mate

A TypeScript React application for investment portfolio management built with Vite, TailwindCSS, Radix UI, and the rjs-frame/rjs-admin libraries.

## Features

- **Three-column layout** using `rjs-admin.layout.ThreeColumnLayout`
- **Investment overview** with portfolio management capabilities
- **Modern UI** with Radix UI components and TailwindCSS styling
- **TypeScript** for type safety
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the application directory:

   ```bash
   cd app/inv-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Building

Build the application for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── pages/
│   └── HomePage.tsx     # Main investment overview page
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
├── index.css            # Global styles and Tailwind imports
└── vite-env.d.ts        # Vite type definitions
```

## Dependencies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **rjs-frame** - Framework utilities
- **rjs-admin** - Admin UI components and layouts
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Features Overview

The investment system includes:

- **Header** with application title and search/notification controls
- **Sidebar** with investment types and quick stats
- **Main content** with portfolio overview, metrics, and recent activity
- **Right panel** with quick actions and portfolio health status
- **Footer** with copyright and last updated information

## Key Differences from inv-admin

This application focuses on:

- **Portfolio management** rather than user administration
- **Investment tracking** with performance and alerts
- **Asset class navigation** for different investment types
- **Real-time portfolio health** monitoring
- **Investment addition and search** functionality

## API Integration

The application is configured to proxy API requests to `http://localhost:8000`. Update the proxy configuration in `vite.config.ts` if your API server runs on a different port.
