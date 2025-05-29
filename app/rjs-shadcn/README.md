# RJS Frame Dashboard Demo

A modern dashboard application built with RJS Frame, React, TypeScript, and shadcn/ui components.

## Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Modular Architecture**: Uses RJS Frame's PageModule and ModuleSlot system
- **Interactive Charts**: Powered by Recharts library
- **Data Tables**: Searchable and paginated user management
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript support
- **Visual Debug Indicators**: ModuleSlot components show green borders and status indicators for development

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui + RJS Frame styles
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Nanostores (via RJS Frame)
- **Routing**: React Router DOM

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── DashboardLayout.tsx # Custom PageLayout implementation
│   └── RouteChangeHandler.tsx # URL sync handler
├── modules/
│   ├── SidebarModule.tsx   # Navigation sidebar
│   ├── StatsModule.tsx     # Key metrics cards
│   ├── ChartModule.tsx     # Interactive charts
│   └── DataTableModule.tsx # User data table
├── lib/
│   └── utils.ts           # Utility functions
└── App.tsx                # Main application component
```

## Dashboard Pages

- **Dashboard**: Overview with stats and charts
- **Analytics**: Detailed analytics charts
- **Users**: User management with search and pagination
- **Reports**: Placeholder for future reports feature
- **Sales**: Sales performance tracking
- **Settings**: Application configuration (coming soon)

## RJS Frame Integration

This demo showcases RJS Frame's key features:

- **PageLayout**: Custom layout component extending RJS Frame's PageLayout
- **ModuleSlot**: Reusable module containers with state management
- **PageModule**: Base class for all dashboard modules
- **URL State Sync**: Automatic synchronization between URL and application state
- **Visual Debug Indicators**: Green borders around ModuleSlots and yellow status indicators

## Development Notes

- **ModuleSlot Styles**: The app includes RJS Frame's built-in styles (`rjs-frame/dist/style.css`) which provide visual indicators for development:
  - Green borders around ModuleSlot components
  - Yellow status indicators showing slot name and status
  - Error and loading states with appropriate styling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
