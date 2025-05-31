# RFX Frontend - Monorepo

A monorepo containing the RJS Framework libraries and demo applications, managed with npm workspaces.

## 🏗️ Project Structure

```
rfx-frontend/
├── lib/                    # Library packages
│   ├── rjs-frame/         # Core RJS Framework library
│   └── rjs-admin/         # Admin UI components library
├── app/                   # Application packages
│   ├── rjs-demo/          # Demo application
│   └── rjs-shadcn/        # ShadCN UI demo application
├── package.json           # Root workspace configuration
├── package-lock.json      # Unified dependency lock file
└── node_modules/          # Shared dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd rfx-frontend
   npm install
   ```

   This will install all dependencies for all workspace packages into a single `node_modules` directory at the root.

2. **Build libraries (required before running apps):**
   ```bash
   npm run build:libs
   ```

## 📦 Workspace Packages

### Libraries

- **`rjs-frame`** (v0.1.0) - Core framework with URL management, page state, and layout components
- **`rjs-admin`** (v0.1.0) - Admin UI library built on Radix UI and Tailwind CSS

### Applications

- **`rjs-demo`** (v0.1.0) - Basic demo showcasing rjs-frame functionality
- **`rjs-shadcn`** (v0.0.0) - Advanced demo with ShadCN UI components

## 🛠️ Development Scripts

### Root-level Commands

```bash
# Install all workspace dependencies
npm install

# Build all packages
npm run build

# Build only libraries
npm run build:libs

# Build only applications
npm run build:apps

# Run development servers for all packages
npm run dev

# Run preview servers for all packages
npm run preview

# Clean all node_modules directories
npm run clean

# Clean all dist directories
npm run clean:dist
```

### Package-specific Commands

```bash
# Run demo app development server
npm run dev:demo

# Run shadcn app development server
npm run dev:shadcn

# Run rjs-frame library in watch mode
npm run dev:frame

# Run rjs-admin library in watch mode
npm run dev:admin

# Run Storybook for rjs-admin component library
npm run storybook
```

### Working with Individual Packages

You can also run commands for specific workspaces:

```bash
# Run command in specific workspace
npm run <script> --workspace=<package-name>

# Examples:
npm run build --workspace=lib/rjs-frame
npm run dev --workspace=app/rjs-demo
npm run test --workspace=lib/rjs-admin
```

## 🔄 Development Workflow

### 1. Library Development

When working on libraries (`rjs-frame` or `rjs-admin`):

```bash
# Start library in watch mode
npm run dev:frame  # or dev:admin

# In another terminal, start an app that uses the library
npm run dev:demo   # or dev:shadcn
```

Changes to libraries will automatically rebuild and be reflected in dependent applications.

### 2. Application Development

When working on applications:

```bash
# Make sure libraries are built first
npm run build:libs

# Start the app development server
npm run dev:demo  # or dev:shadcn
```

### 3. Adding Dependencies

**For workspace packages:**
```bash
# Add dependency to specific workspace
npm install <package> --workspace=<workspace-name>

# Examples:
npm install lodash --workspace=lib/rjs-frame
npm install @types/lodash --workspace=lib/rjs-frame --save-dev
```

**For root workspace:**
```bash
# Add shared development tools at root level
npm install <package> --save-dev
```

## 🏛️ Workspace Benefits

### ✅ Advantages

- **Unified Dependencies**: Single `node_modules` directory reduces disk space and installation time
- **Consistent Versions**: Shared dependencies are automatically deduped
- **Cross-package Development**: Easy development of interdependent packages
- **Simplified Scripts**: Run commands across all packages or target specific ones
- **Better Caching**: npm can cache dependencies more effectively

### 📁 Directory Structure

- **Single `node_modules`**: All dependencies installed at root level
- **Symlinked Packages**: Local packages are symlinked for development
- **Shared Lock File**: Single `package-lock.json` ensures consistent installs

## 🔧 Build Process

### Library Build Order

1. **`rjs-frame`** - Core library (no dependencies on other workspace packages)
2. **`rjs-admin`** - Depends on `rjs-frame`

### Application Dependencies

- **`rjs-demo`** - Depends on `rjs-frame`
- **`rjs-shadcn`** - Depends on `rjs-frame`

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   ```bash
   # Make sure libraries are built
   npm run build:libs
   ```

2. **Dependency resolution issues:**
   ```bash
   # Clear everything and reinstall
   npm run clean
   npm install
   ```

3. **Workspace linking issues:**
   ```bash
   # Verify workspace structure
   npm list --depth=0
   ```

### Known Issues

#### rjs-shadcn Build Error
The `rjs-shadcn` app currently has a TypeScript/Vite plugin compatibility issue during build. This is likely due to version mismatches between different Vite installations. 

**Workaround:** You can still run the development server:
```bash
npm run dev:shadcn
```

**Status:** Under investigation. The issue doesn't affect the core workspace functionality.

### Verification Commands

```bash
# Check workspace packages are properly linked
npm list --depth=0

# Verify no individual node_modules exist
find . -name "node_modules" -type d | grep -v "./node_modules"

# Test build process
npm run build:libs && npm run build:apps
```

## 📝 Notes

- **Workspace Syntax**: Dependencies use version numbers (`"rjs-frame": "0.1.0"`) rather than `workspace:*` for compatibility
- **Peer Dependencies**: React and related packages are managed as peer dependencies to avoid conflicts
- **Development Dependencies**: Shared tools (TypeScript, etc.) are hoisted to root level when possible

## 🚢 Deployment

For production builds:

```bash
# Build all packages
npm run build

# Libraries will be in lib/*/dist/
# Applications will be in app/*/dist/
```

Each package maintains its own build output in its respective `dist/` directory. 