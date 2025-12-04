# React SPA Template

一个成熟的前端 CSR SPA 项目开发模板，基于 Vite + React + TypeScript 构建。

## ✨ 特性

- 🚀 **Vite** - 极速的开发体验
- ⚛️ **React 19.2.0** - 最新版本的 React
- 📘 **TypeScript** - 类型安全
- 🎨 **Ant Design Mobile** - 移动端 UI 组件库
- 🛣️ **React Router v7** - 路由管理，支持懒加载和路由守卫
- 📦 **HashRouter** - 使用 Hash 模式路由
- 🎯 **代码规范** - ESLint + Prettier + Husky
- 📱 **移动端适配** - postcss-mobile-forever
- 🔧 **工具库** - lodash-es、dayjs、classnames
- 🛡️ **错误边界** - react-error-boundary
- 🐛 **调试工具** - vConsole
- 🌐 **环境变量** - dotenv 支持

## 📁 项目结构

```
react-spa-template/
├── entry/              # HTML 入口文件（支持未来 MPA 扩展）
│   └── index.html
├── public/             # 静态资源
├── src/
│   ├── api/           # API 接口
│   ├── assets/        # 资源文件
│   ├── components/    # 公共组件
│   ├── constants/     # 常量定义
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── styles/        # 样式文件
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   ├── App.tsx        # 根组件
│   └── main.tsx       # 入口文件
├── .env.example       # 环境变量示例
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── eslint.config.js   # ESLint 配置
├── postcss.config.js  # PostCSS 配置
├── vite.config.ts     # Vite 配置
└── package.json
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

## 📝 环境变量

复制 `.env.example` 文件创建 `.env.local` 并根据需要修改：

```bash
cp .env.example .env.local
```

## 🔧 配置说明

### 移动端适配

项目使用 `postcss-mobile-forever` 进行移动端适配，默认设计稿宽度为 375px，可在 `postcss.config.js` 中修改。

### 路由守卫

路由守卫配置在 `src/router/index.tsx` 中，可以针对特定路由添加权限检查。

### API 配置

API 基础配置在 `src/constants/index.ts` 中，通过环境变量 `VITE_API_BASE_URL` 设置。

### 错误边界

项目已集成错误边界组件，自动捕获并处理运行时错误。

### vConsole 调试

在开发环境或设置 `VITE_VCONSOLE_ENABLED=true` 时会自动启用 vConsole 调试工具。

## 📦 工具库

- **lodash-es** - 工具函数库
- **dayjs** - 日期时间处理
- **classnames** - CSS 类名管理
- **axios** - HTTP 请求库

## 🎯 最佳实践

1. 使用 TypeScript 确保类型安全
2. 遵循 ESLint 和 Prettier 配置
3. 使用路由懒加载 + Suspense + 骨架屏优化首屏体验
4. 合理使用错误边界与监控（`AppErrorBoundary` + `utils/report`）
5. 充分利用工具库与 http 封装提高开发效率

### 性能与首屏优化建议

- 按需引入组件库（antd-mobile 中只按需引入实际使用的组件）
- 路由级懒加载 + `Suspense` 包裹页面，搭配 `PageSkeleton` 做骨架屏
- 列表图片采用懒加载（如 `loading="lazy"` 或第三方懒加载库）
- 避免在首屏渲染时做重计算，可用 `useMemo`、`useDeferredValue` 等做优化

### 安全与规范建议

- 所有本地存储统一使用 `src/utils/storage.ts`，避免在业务代码中直接使用 `localStorage`
- 生产环境建议在服务端配置基本 CSP（Content-Security-Policy）策略，防止 XSS 注入
- 对所有外部输入（URL 参数、接口入参等）做好校验与转义
- 不在前端代码中硬编码敏感信息（密钥、内网地址等），统一通过环境变量与后端网关控制

## 🧱 作为脚手架如何二次开发

这一节是从“脚手架”的视角，教你如何在此模板上快速扩展业务。

### 1. 新增一个页面（Page）

1. 在 `src/pages` 下创建新目录，例如 `Profile/`：
   ```bash
   src/pages/Profile/
     ├── index.tsx
     └── index.scss
   ```
2. 在 `index.tsx` 中编写页面组件，并引入样式：

   ```tsx
   import './index.scss'

   export default function Profile() {
   	return <div className="profile-page">Profile Page</div>
   }
   ```

### 2. 注册路由

路由采用“模块化配置”，在 `src/router/modules` 下新增一个路由模块：

1. 新建文件 `src/router/modules/profile.ts`：

   ```ts
   import type { RouteObject } from 'react-router-dom'
   import { lazy } from 'react'

   const ProfilePage = lazy(() => import('@/pages/Profile'))

   export const profileRoutes: RouteObject[] = [
   	{
   		path: '/profile',
   		element: <ProfilePage />,
   	},
   ]
   ```

2. 在 `src/router/modules/index.ts` 中汇总导出：
   ```ts
   export * from './home'
   export * from './user'
   export * from './theme'
   export * from './profile' // 新增
   ```

这样新页面就会自动加入到主路由表中，无需改动核心路由逻辑。

### 3. 新增一个 API 接口

1. 在 `src/api/index.ts` 中补充接口函数：

   ```ts
   import { request } from '@/utils/request'
   import type { ApiResponse } from '@/types'

   export const getProfile = (id: string) => {
   	return request.get<ApiResponse<any>>(`/profile/${id}`)
   }
   ```

2. 在页面中直接调用：
   ```ts
   import { getProfile } from '@/api'
   ```

### 4. 使用和扩展全局状态（Zustand）

本模板推荐的状态管理策略：

- **组件局部状态**：优先使用 `useState` / `useReducer`
- **跨组件 / 跨页面共享状态**：使用 `zustand`（`src/store` 目录）
- 避免将所有数据都塞进全局 store，保持 store 精简、可维护

示例：

- `src/store/userStore.ts`：用户信息 store，包含：
  - `user`：当前用户信息（持久化到 localStorage）
  - `fetchCurrentUser`：模拟异步拉取当前用户信息
- `src/store/appStore.ts`：应用级 store，包含：
  - `appReady`：应用是否初始化完成
  - `globalLoading`：全局 loading 状态
  - `themeId`：当前主题 id，并与本地存储同步

在组件中使用时建议通过“选择器”只取需要的字段，减少重渲染：

```ts
import { useUserStore } from '@/store/userStore'

const user = useUserStore(state => state.user)
const fetchCurrentUser = useUserStore(state => state.fetchCurrentUser)
```

### 5. 新增环境变量

1. 在 `.env.development` / `.env.production` 中添加：
   ```bash
   VITE_API_BASE_URL=https://api.example.com
   VITE_FEATURE_X_ENABLED=true
   ```
2. 在代码中通过 `import.meta.env` 使用：
   ```ts
   const baseURL = import.meta.env.VITE_API_BASE_URL
   const featureEnabled = import.meta.env.VITE_FEATURE_X_ENABLED === 'true'
   ```
3. 如果是“必需”的关键变量，可以在 `src/constants/index.ts` 中集中读取并做兜底。

### 6. 新增主题 / 品牌色

1. 在 `src/styles/theme` 下新增一个主题文件，例如 `brand3.scss`。
2. 在 `src/theme/tokens.ts` 中补充主题元数据：

   ```ts
   export type BrandId = 'default' | 'brand1' | 'brand2' | 'brand3'

   export const BRAND_OPTIONS: { id: BrandId; name: string }[] = [
   	{ id: 'default', name: '默认主题' },
   	{ id: 'brand1', name: '品牌一' },
   	{ id: 'brand2', name: '品牌二' },
   	{ id: 'brand3', name: '品牌三' },
   ]
   ```

3. 在 `ThemeDemo` 页面中自动出现新主题选项（依赖上述配置）。

### 7. 代码规范与提交流程

1. 开发时建议开启 VS Code 的 ESLint 插件，保存自动修复大部分问题。
2. 提交前会自动运行 `lint-staged`（由 Husky 触发），只检查改动的文件：
   ```bash
   git commit -m "feat: add profile page"
   ```
3. 如果想手动全量修复：
   ```bash
   pnpm lint:fix
   ```

这一整套流程就是“脚手架级”的使用姿势：**新增页面 → 注册路由 → 封装 API → 使用状态管理与主题 → 通过脚本与规范收尾**。

## 📄 License

MIT
