# Invest Mate Admin

A TypeScript React application for investment administration built with Vite, TailwindCSS, Radix UI, and the rjs-frame/rjs-admin libraries.

## Features

- **Three-column layout** using `rjs-admin.layout.ThreeColumnLayout`
- **Admin dashboard** with investment management capabilities
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
   cd app/inv-admin
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

The application will be available at `http://localhost:5173`

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
│   └── HomePage.tsx     # Main dashboard page
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

The admin dashboard includes:

- **Header** with application title and settings
- **Sidebar** with navigation menu for investments, users, and reports
- **Main content** with dashboard metrics and recent activity
- **Right panel** with quick actions and system status
- **Footer** with copyright and version information

## API Integration

The application is configured to proxy API requests to `http://localhost:8000`. Update the proxy configuration in `vite.config.ts` if your API server runs on a different port.
