<div align="center">

**English** | [中文](./README.md)

</div>

# React SPA Template

A mature frontend CSR SPA project template built with Vite + React + TypeScript.

## ✨ Features

- 🚀 **Vite 5.4.8** - Lightning-fast development experience
- ⚛️ **React 19.2.0** - Latest version of React
- 📘 **TypeScript 5.6.2** - Type safety
- 🎨 **Ant Design Mobile 5.41.1** - Mobile UI component library
- 🛣️ **React Router v7.9.0** - Route management with lazy loading and route guards
- 📦 **HashRouter** - Hash mode routing
- 🎯 **Code Standards** - ESLint + Prettier + Husky
- 📱 **Mobile Adaptation** - postcss-mobile-forever
- 🔧 **Utility Libraries** - lodash-es, dayjs, classnames
- 🛡️ **Error Boundaries** - react-error-boundary
- 🐛 **Debug Tools** - vConsole
- 🌐 **Environment Variables** - dotenv support
- 📦 **State Management** - Zustand 5.0.9
- 🌈 **Multi-Theme Support** - Configurable brand theme switching
- 🔄 **HTTP Encapsulation** - Complete axios-based encapsulation with singleton/multi-instance, request deduplication, error handling, etc.

## 📁 Project Structure

```
react-spa-template/
├── entry/                    # HTML entry files (supports future MPA expansion)
│   └── index.html
├── public/                   # Static resources
├── docs/                     # Project documentation
│   ├── PAGE_ORGANIZATION_GUIDE.md      # Page directory organization guide
│   ├── PAGE_ORGANIZATION_EXAMPLE.md    # Page organization examples
│   ├── COMPONENT_ORGANIZATION_GUIDE.md # Component organization guide
│   ├── REACT_HOOKS_GUIDE.md            # React Hooks guide (for Vue developers)
│   ├── ZUSTAND_GUIDE.md                # Zustand usage guide
│   ├── THEME_GUIDE.md                  # Theme configuration guide
│   ├── ROUTER_V7_MIGRATION.md          # React Router v7 migration guide
│   └── ...                             # More documentation
├── src/
│   ├── api/                  # API interfaces
│   ├── assets/               # Resource files
│   ├── components/           # Public components
│   │   ├── ErrorBoundary/    # Error boundary
│   │   ├── Loading/          # Loading component
│   │   ├── RouteError/       # Route error component
│   │   └── Skeleton/          # Skeleton screen
│   ├── constants/            # Constant definitions
│   ├── hooks/                # Global Hooks
│   │   └── useRouter.ts      # Router Hook
│   ├── pages/                # Page components (organized by business module)
│   │   ├── Home/             # Home module
│   │   │   ├── index.tsx
│   │   │   ├── index.module.scss
│   │   │   ├── api.ts         # Page-level API
│   │   │   ├── components/    # Page-specific components
│   │   │   │   ├── HomeHeader.tsx
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   └── ...
│   │   │   └── hooks/         # Page-specific Hooks
│   │   │       └── useAppStatus.ts
│   │   ├── User/              # User module
│   │   │   └── index.tsx
│   │   ├── Article/           # Article module (example: multi-level nested pages)
│   │   │   ├── List/          # List page (level 1)
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── components/  # List page-specific components
│   │   │   │   ├── hooks/        # List page-specific Hooks
│   │   │   │   └── api.ts        # List page API
│   │   │   ├── Detail/        # Detail page (level 2)
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── components/  # Detail page-specific components
│   │   │   │   ├── hooks/        # Detail page-specific Hooks
│   │   │   │   └── api.ts        # Detail page API
│   │   │   └── Edit/          # Edit page (level 2)
│   │   │       └── index.tsx
│   │   ├── User/              # User module (example: three-level pages)
│   │   │   ├── Profile/       # Profile (level 1)
│   │   │   ├── Settings/       # Settings (level 1)
│   │   │   └── Orders/         # Orders module (level 1)
│   │   │       ├── List/       # Order list (level 2)
│   │   │       │   └── index.tsx
│   │   │       └── Detail/     # Order detail (level 3)
│   │   │           ├── index.tsx
│   │   │           ├── components/
│   │   │           └── hooks/
│   │   ├── NotFound/          # 404 page
│   │   └── ThemeDemo/          # Theme demo page
│   ├── router/                # Route configuration
│   │   ├── modules/           # Route modules (organized by business)
│   │   │   ├── home.ts        # Home module routes
│   │   │   ├── user.ts        # User module routes
│   │   │   ├── theme.ts       # Theme module routes
│   │   │   ├── index.ts       # Route merge
│   │   │   └── README.md      # Route module documentation
│   │   ├── guards.tsx         # Route guards
│   │   ├── utils.tsx          # Route utility functions
│   │   └── index.tsx          # Route entry
│   ├── store/                 # State management (Zustand)
│   │   ├── userStore.ts       # User state
│   │   └── appStore.ts        # Application state
│   ├── styles/                # Style files
│   │   ├── index.scss         # Global style entry
│   │   ├── reset.scss         # Style reset
│   │   ├── variables.scss     # CSS variables
│   │   └── theme/             # Theme styles
│   │       ├── default.scss
│   │       ├── brand1.scss
│   │       └── brand2.scss
│   ├── theme/                 # Theme management
│   │   ├── tokens.ts          # Theme configuration
│   │   ├── applyTheme.ts      # Theme application
│   │   ├── useTheme.ts        # Theme Hook
│   │   └── antd-overrides.scss # Ant Design style overrides
│   ├── types/                 # TypeScript types
│   │   ├── index.ts           # Common types
│   │   └── global.d.ts        # Global type declarations
│   ├── utils/                 # Utility functions
│   │   ├── http/              # HTTP request encapsulation
│   │   │   ├── core.ts         # Core factory function
│   │   │   ├── types.ts        # Type definitions
│   │   │   ├── constants.ts    # Constant definitions
│   │   │   ├── interceptors/   # Interceptors
│   │   │   ├── transform/      # Response/error transformation
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── README.md       # HTTP usage documentation
│   │   │   └── index.ts        # Default export
│   │   ├── common.ts           # Common utilities
│   │   ├── format.ts           # Formatting utilities
│   │   ├── validate.ts         # Validation utilities
│   │   ├── storage.ts          # Storage utilities
│   │   ├── env.ts              # Environment detection
│   │   ├── report.ts           # Monitoring and reporting
│   │   └── index.ts            # Unified utility export
│   ├── AppRoot.tsx             # Root component
│   └── main.tsx                # Entry file
├── .env.example                # Environment variable example
├── .env.development            # Development environment variables
├── .env.production             # Production environment variables
├── eslint.config.js            # ESLint configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
└── package.json
```

> 📖 **Page Directory Organization**: The project uses a **nested organization by business module** directory structure, supporting multi-level nested pages (detail pages, edit pages, etc.). For detailed information, please refer to [Page Directory Organization Guide](./docs/PAGE_ORGANIZATION_GUIDE.md) and [Page Organization Examples](./docs/PAGE_ORGANIZATION_EXAMPLE.md).

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Code Check

```bash
pnpm lint
```

### Code Format

```bash
pnpm format
```

> 📖 **Quick Start Guide**: For more detailed information, please refer to [QUICK_START.md](./QUICK_START.md)

## 📝 Environment Variables

Copy `.env.example` to create `.env.local` and modify as needed:

```bash
cp .env.example .env.local
```

## 🔧 Configuration

### Mobile Adaptation

The project uses `postcss-mobile-forever` for mobile adaptation. The default design width is 375px, which can be modified in `postcss.config.js`.

### Routing System

The project uses **React Router v7** with **configuration-based routing** and **flat route configuration** (recommended).

- **Route Configuration**: Routes are organized by business module in `src/router/modules/`
- **Route Navigation**: Use `path` for navigation (React Router does not support navigation via `name`)
- **Route Guards**: Supports asynchronous route guards
- **Route Lazy Loading**: Automatically supported, no additional configuration needed

> 📖 **Routing Documentation**:
>
> - [Route Module Documentation](./src/router/modules/README.md)
> - [React Router v7 Migration Guide](./docs/ROUTER_V7_MIGRATION.md)
> - [Route Configuration Comparison](./docs/ROUTE_COMPARISON.md)

### HTTP Request Encapsulation

The project provides complete HTTP request encapsulation based on `axios`, supporting:

- ✅ Singleton/Multi-instance mode
- ✅ Request deduplication (automatically cancels duplicate requests)
- ✅ Unified error handling
- ✅ Success/failure message prompts
- ✅ Request/response interceptors
- ✅ Automatic token attachment
- ✅ Automatic FormData handling
- ✅ Custom timeout
- ✅ Skip error handling (`skipErrorHandler`)

> 📖 **HTTP Usage Documentation**: For detailed usage instructions, please refer to [HTTP Usage Documentation](./src/utils/http/README.md)

### State Management (Zustand)

The project uses **Zustand** for state management. Recommended strategy:

- **Component Local State**: Use `useState` / `useReducer`
- **Cross-component/Cross-page Shared State**: Use `zustand` (`src/store` directory)

> 📖 **Zustand Usage Guide**: For detailed usage instructions and common pitfalls, please refer to [Zustand Usage Guide](./docs/ZUSTAND_GUIDE.md)

### Theme System

The project supports multi-theme switching. Themes can be configured in `src/theme/tokens.ts`.

> 📖 **Theme Configuration Guide**: For detailed information, please refer to [Theme Configuration Guide](./docs/THEME_GUIDE.md)

### Error Boundaries

The project has integrated error boundary components that automatically catch and handle runtime errors.

### vConsole Debugging

vConsole debugging tool is automatically enabled in development environment or when `VITE_VCONSOLE_ENABLED=true` is set.

## 📦 Utility Libraries

- **lodash-es** - Utility function library
- **dayjs** - Date and time processing
- **classnames** - CSS class name management
- **axios** - HTTP request library

> 📖 **Lodash Import Guide**: For best practices on on-demand imports, please refer to [Lodash Import Guide](./docs/LODASH_IMPORT_GUIDE.md)

## 🎯 Best Practices

1. **Use TypeScript to ensure type safety**
2. **Follow ESLint and Prettier configuration**
3. **Use route lazy loading + Suspense + skeleton screen to optimize first-screen experience**
4. **Properly use error boundaries and monitoring** (`AppErrorBoundary` + `utils/report`)
5. **Fully utilize utility libraries and http encapsulation to improve development efficiency**

### Page Organization

- **Directory Structure**: Nested organization by business module (`pages/Article/List/`, `pages/Article/Detail/`)
- **Route Configuration**: Use flat route configuration (flexible, easy to adjust)
- **Resource Cohesion**: Page-level resources (components, hooks, API) are placed in the page directory

> 📖 **Page Organization Documentation**:
>
> - [Page Directory Organization Guide](./docs/PAGE_ORGANIZATION_GUIDE.md)
> - [Page Organization Examples](./docs/PAGE_ORGANIZATION_EXAMPLE.md)

### Component Organization

- **Container/Presentational Component Separation**: Business logic is placed in container components or custom Hooks
- **Page-level Components**: Placed in `pages/[Module]/components/`
- **Global Components**: Placed in `src/components/`

> 📖 **Component Organization Guide**: For detailed information, please refer to [Component Organization Guide](./docs/COMPONENT_ORGANIZATION_GUIDE.md)

### React Hooks

The project uses React 19.2.0, supporting the latest Hooks API.

> 📖 **React Hooks Guide**: For a React Hooks guide for Vue developers, please refer to [React Hooks Guide](./docs/REACT_HOOKS_GUIDE.md)

### Performance and First-Screen Optimization Recommendations

- Import component libraries on demand (only import actually used components from antd-mobile)
- Route-level lazy loading + `Suspense` wrapping pages, paired with `PageSkeleton` for skeleton screens
- Use lazy loading for list images (e.g., `loading="lazy"` or third-party lazy loading libraries)
- Avoid heavy calculations during first-screen rendering, use `useMemo`, `useDeferredValue`, etc. for optimization

### Security and Standards Recommendations

- All local storage should use `src/utils/storage.ts` uniformly, avoid directly using `localStorage` in business code
- Production environment should configure basic CSP (Content-Security-Policy) policies on the server side to prevent XSS injection
- Validate and escape all external inputs (URL parameters, API input parameters, etc.)
- Do not hardcode sensitive information (keys, internal network addresses, etc.) in frontend code, use environment variables and backend gateway control uniformly

## 🧱 How to Extend as a Scaffold

This section teaches you how to quickly extend business on this template from a "scaffold" perspective.

### 1. Add a New Page

#### Simple Page (Level 1)

1. Create a new directory under `src/pages`, for example `Profile/`:
   ```bash
   src/pages/Profile/
     ├── index.tsx
     └── index.module.scss
   ```
2. Write the page component in `index.tsx` and import styles:

   ```tsx
   import styles from './index.module.scss'

   export default function Profile() {
   	return <div className={styles.profilePage}>Profile Page</div>
   }
   ```

#### Nested Pages (Multi-level Pages)

For pages that need multi-level nesting (such as list pages, detail pages, edit pages), organize by business module:

```bash
src/pages/Article/              # Article module
  ├── List/                    # List page (level 1)
  │   ├── index.tsx
  │   ├── index.module.scss
  │   ├── components/          # List page-specific components
  │   ├── hooks/               # List page-specific Hooks
  │   └── api.ts               # List page API
  ├── Detail/                  # Detail page (level 2)
  │   ├── index.tsx
  │   ├── components/
  │   └── hooks/
  └── Edit/                    # Edit page (level 2)
      └── index.tsx
```

> 📖 **Page Organization**: For detailed information, please refer to [Page Directory Organization Guide](./docs/PAGE_ORGANIZATION_GUIDE.md)

### 2. Register Routes

Routes use "modular configuration". Add a new route module under `src/router/modules`:

1. Create a new file `src/router/modules/article.ts`:

   ```ts
   import type { RouteConfig } from '@/types'

   export const articleRoutes: RouteConfig[] = [
   	{
   		path: '/article', // Route path, used for URL mapping and navigation
   		name: 'ArticleList', // Route name, only for identification, not for navigation
   		meta: {
   			title: 'Article List',
   		},
   		component: () => import('@/pages/Article/List/index'),
   	},
   	{
   		path: '/article/:id', // Detail page path
   		name: 'ArticleDetail',
   		meta: {
   			title: 'Article Detail',
   		},
   		component: () => import('@/pages/Article/Detail/index'),
   	},
   ]
   ```

2. Export and merge in `src/router/modules/index.ts`:
   ```ts
   import { articleRoutes } from './article' // New
   export const routeModules: RouteConfig[] = [
   	...homeRoutes,
   	...userRoutes,
   	...themeRoutes,
   	...articleRoutes, // New
   	// ...
   ]
   ```

> 📖 **Route Configuration**: For detailed information, please refer to [Route Module Documentation](./src/router/modules/README.md)

### 3. Add a New API Interface

1. Create `api.ts` in the page directory (page-level API) or add to `src/api/index.ts` (global API):

   ```ts
   import http from '@/utils/http'

   export const getArticleList = (params: any) => {
   	return http.get('/api/article/list', { params })
   }
   ```

2. Call directly in the page:
   ```ts
   import { getArticleList } from './api'
   ```

> 📖 **HTTP Usage**: For detailed information, please refer to [HTTP Usage Documentation](./src/utils/http/README.md)

### 4. Use and Extend Global State (Zustand)

Recommended state management strategy for this template:

- **Component Local State**: Prefer `useState` / `useReducer`
- **Cross-component / Cross-page Shared State**: Use `zustand` (`src/store` directory)
- Avoid putting all data into global store, keep stores lean and maintainable

Examples:

- `src/store/userStore.ts`: User information store, including:
  - `user`: Current user information (persisted to localStorage)
  - `fetchCurrentUser`: Simulated async fetch of current user information
- `src/store/appStore.ts`: Application-level store, including:
  - `appReady`: Whether the application has completed initialization
  - `globalLoading`: Global loading state
  - `themeId`: Current theme id, synchronized with local storage

When using in components, it's recommended to only select needed fields through "selectors" to reduce re-renders:

```ts
import { useUserStore } from '@/store/userStore'

const user = useUserStore(state => state.user)
const fetchCurrentUser = useUserStore(state => state.fetchCurrentUser)
```

> 📖 **Zustand Usage**: For more notes and common pitfalls, please refer to [Zustand Usage Guide](./docs/ZUSTAND_GUIDE.md).

### 5. Add Environment Variables

1. Add to `.env.development` / `.env.production`:
   ```bash
   VITE_API_BASE_URL=https://api.example.com
   VITE_FEATURE_X_ENABLED=true
   ```
2. Use in code via `import.meta.env`:
   ```ts
   const baseURL = import.meta.env.VITE_API_BASE_URL
   const featureEnabled = import.meta.env.VITE_FEATURE_X_ENABLED === 'true'
   ```
3. If it's a "required" key variable, you can centrally read and provide fallback in `src/constants/index.ts`.

### 6. Add Theme / Brand Color

1. Create a new theme file under `src/styles/theme`, for example `brand3.scss`.
2. Add theme metadata in `src/theme/tokens.ts`:

   ```ts
   export type BrandId = 'default' | 'brand1' | 'brand2' | 'brand3'

   export const BRAND_OPTIONS: { id: BrandId; name: string }[] = [
   	{ id: 'default', name: 'Default Theme' },
   	{ id: 'brand1', name: 'Brand One' },
   	{ id: 'brand2', name: 'Brand Two' },
   	{ id: 'brand3', name: 'Brand Three' },
   ]
   ```

3. The new theme option will automatically appear in the `ThemeDemo` page (depends on the above configuration).

> 📖 **Theme Configuration**: For detailed information, please refer to [Theme Configuration Guide](./docs/THEME_GUIDE.md)

### 7. Code Standards and Submission Process

1. It's recommended to enable VS Code's ESLint plugin during development, which will automatically fix most issues on save.
2. `lint-staged` will automatically run before submission (triggered by Husky), only checking changed files:
   ```bash
   git commit -m "feat: add profile page"
   ```
3. If you want to manually fix all files:
   ```bash
   pnpm lint:fix
   ```

This entire workflow is the "scaffold-level" usage pattern: **Add Page → Register Route → Encapsulate API → Use State Management & Theme → Finish with Scripts & Standards**.

## 📚 Documentation Index

### Core Documentation

- [Quick Start Guide](./QUICK_START.md) - Project quick start guide
- [Project Summary](./PROJECT_SUMMARY.md) - Project feature summary

### Development Guides

- [Page Directory Organization Guide](./docs/PAGE_ORGANIZATION_GUIDE.md) - Best practices for page directory organization
- [Page Organization Examples](./docs/PAGE_ORGANIZATION_EXAMPLE.md) - Multi-level nested page examples
- [Component Organization Guide](./docs/COMPONENT_ORGANIZATION_GUIDE.md) - Best practices for component organization
- [React Hooks Guide](./docs/REACT_HOOKS_GUIDE.md) - React Hooks guide for Vue developers
- [Zustand Usage Guide](./docs/ZUSTAND_GUIDE.md) - Zustand state management usage guide

### Routing Related

- [Route Module Documentation](./src/router/modules/README.md) - Route module usage documentation
- [React Router v7 Migration Guide](./docs/ROUTER_V7_MIGRATION.md) - React Router v7 migration guide
- [Route Configuration Comparison](./docs/ROUTE_COMPARISON.md) - Route configuration method comparison

### HTTP Requests

- [HTTP Usage Documentation](./src/utils/http/README.md) - HTTP request encapsulation usage documentation

### Theme System

- [Theme Configuration Guide](./docs/THEME_GUIDE.md) - Theme configuration and usage guide

### Utility Libraries

- [Lodash Import Guide](./docs/LODASH_IMPORT_GUIDE.md) - Best practices for on-demand Lodash imports

### Build and Deployment

- [Build Command Guide](./docs/BUILD_COMMAND_GUIDE.md) - Detailed build command documentation

### React Version

- [React Version Notes](./docs/REACT_VERSION_NOTE.md) - React version related notes
- [React 19 Usage Guide](./docs/REACT_19_USAGE.md) - React 19 new features usage guide

### Architecture Design

- [Subpackages Architecture Design](./docs/SUBPACKAGES_ARCHITECTURE.md) - Subpackages architecture design documentation

## 📄 License

MIT
