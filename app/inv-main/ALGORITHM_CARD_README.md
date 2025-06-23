# AlgorithmCard Component

A React component for displaying algorithm data in a friendly, compact format.

## Features

- **Compact Design**: Displays all algorithm metadata in a clean, card-based layout
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Interactive**: Hover effects and click handlers
- **Color-coded**: Visual indicators for market, tags, and compute tiers
- **Formatted Data**: Human-readable dates, truncated IDs, and organized parameters

## Usage

### Basic Usage

```tsx
import { AlgorithmCard } from "./components/AlgorithmCard";
import type { AlgorithmData } from "./types/algorithm";

const algorithm: AlgorithmData = {
  key: "ema_crossover",
  name: "VN EMA Crossover",
  description: "VN Exponential Moving Average Crossover",
  market: "VN",
  tags: ["EMA", "TA"],
  // ... other properties
};

function MyComponent() {
  return (
    <AlgorithmCard
      algorithm={algorithm}
      onClick={() => console.log("Algorithm clicked")}
    />
  );
}
```

### Props

| Prop        | Type            | Required | Description               |
| ----------- | --------------- | -------- | ------------------------- |
| `algorithm` | `AlgorithmData` | Yes      | The algorithm data object |
| `className` | `string`        | No       | Additional CSS classes    |
| `onClick`   | `() => void`    | No       | Click handler function    |

### Data Structure

The component expects an `AlgorithmData` object with the following structure:

```typescript
interface AlgorithmData {
  key: string;
  name: string;
  description: string;
  market: string;
  tags: string[];
  params: AlgorithmParams;
  configuration: number[];
  compute_tier: number;
  id: string;
  _created: string;
  _creator: string;
  _updated: string | null;
  _updater: string | null;
  _realm: string | null;
  _deleted: string | null;
  _etag: string | null;
}
```

## Demo

Visit `/algorithms` in the application to see the component in action with sample data.

## Styling

The component uses Tailwind CSS classes and includes:

- Hover effects with shadow transitions
- Color-coded badges for market and tags
- Icons from Lucide React
- Responsive grid layouts
- Custom line-clamp utilities for text truncation

## Examples

### Single Card

```tsx
<AlgorithmCard algorithm={algorithm} />
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {algorithms.map((algorithm) => (
    <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
  ))}
</div>
```

### With Custom Styling

```tsx
<AlgorithmCard
  algorithm={algorithm}
  className="max-w-sm bg-blue-50"
  onClick={() => handleAlgorithmSelect(algorithm)}
/>
```

## Dependencies

- React 19+
- Tailwind CSS
- Lucide React (for icons)
- TypeScript

## File Structure

```
src/
├── components/
│   └── AlgorithmCard.tsx
├── types/
│   └── algorithm.d.ts
├── pages/
│   └── AlgorithmDemoPage.tsx
└── styles/
    └── index.css (includes line-clamp utilities)
```
