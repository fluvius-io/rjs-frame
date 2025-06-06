# RJS Frame + shadcn/ui Demo

This is a demonstration project that showcases the integration of **RJS Frame** with **shadcn/ui** components, creating a modern, modular dashboard application.

## Features

- **Modular Architecture**: Uses RJS Frame's PageModule and PageSlot system
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first responsive layout
- **Dark Mode Support**: Integrated theme switching
- **TypeScript**: Full TypeScript support throughout
- **Visual Debug Indicators**: PageSlot components show green borders and status indicators for development

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **RJS Frame** - Modular layout framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Basic familiarity with React and TypeScript

### Installation

1. Clone the repository and navigate to this project:
```bash
cd app/rjs-shadcn
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── DashboardLayout.tsx
├── modules/            # RJS Frame modules
│   ├── SidebarModule.tsx
│   ├── StatsModule.tsx
│   ├── ChartModule.tsx
│   └── DataTableModule.tsx
├── lib/                # Utility functions
└── App.tsx             # Main application
```

## Key Concepts

### RJS Frame Integration

This demo showcases several RJS Frame concepts:

- **PageLayout**: The `DashboardLayout` component extends RJS Frame's `PageLayout`
- **PageModule**: All modules extend `PageModule` for consistent behavior
- **PageSlot**: Reusable module containers with state management
- **State Management**: Centralized page state with automatic persistence
- **URL Parameters**: Dynamic content based on route parameters
- **Visual Debug Indicators**: Green borders around PageSlots and yellow status indicators

### shadcn/ui Components

- **PageSlot Styles**: The app includes RJS Frame's built-in styles (`rjs-frame/dist/style.css`) which provide visual indicators for development:
- Green borders around PageSlot components
- Yellow status indicators showing slot names and parameters
- Hover effects for better debugging experience

## Development Features

### Debug Mode

Press `Ctrl+O` to open the PageLayout Options dialog which shows:
- Layout structure and module information  
- X-Ray mode toggle for visual debugging
- Instance management warnings

### Hot Module Replacement

Vite provides instant updates during development - modify any component and see changes immediately.

### TypeScript Support

Full TypeScript integration with proper type checking for:
- RJS Frame components and props
- shadcn/ui component interfaces
- Custom module props and state

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, optimized and ready for deployment.

## Customization

### Adding New Modules

1. Create a new module in `src/modules/`:

```typescript
import { PageModule } from 'rjs-frame';

export class CustomModule extends PageModule {
  renderContent() {
    return <div>Custom content</div>;
  }
}
```

2. Import and use in your layout:

```typescript
import { CustomModule } from './modules/CustomModule';

const modules = {
  custom: <CustomModule />
};
```

### Styling

The project uses Tailwind CSS with shadcn/ui. Customize the design by:

1. Modifying `tailwind.config.js`
2. Updating component styles in individual files
3. Adding custom CSS in `src/index.css`

## Learn More

- [RJS Frame Documentation](../../lib/rjs-frame/docs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
