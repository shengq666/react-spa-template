# React SPA Template

一个成熟的前端 CSR SPA 项目开发模板，基于 Vite + React + TypeScript 构建。

## ✨ 特性

- 🚀 **Vite 5.4.8** - 极速的开发体验
- ⚛️ **React 19.2.0** - 最新版本的 React
- 📘 **TypeScript 5.6.2** - 类型安全
- 🎨 **Ant Design Mobile 5.41.1** - 移动端 UI 组件库
- 🛣️ **React Router v7.9.0** - 路由管理，支持懒加载和路由守卫
- 📦 **HashRouter** - 使用 Hash 模式路由
- 🎯 **代码规范** - ESLint + Prettier + Husky
- 📱 **移动端适配** - postcss-mobile-forever
- 🔧 **工具库** - lodash-es、dayjs、classnames
- 🛡️ **错误边界** - react-error-boundary
- 🐛 **调试工具** - vConsole
- 🌐 **环境变量** - dotenv 支持
- 📦 **状态管理** - Zustand 5.0.9
- 🌈 **多主题支持** - 可配置的品牌主题切换
- 🔄 **HTTP 封装** - 基于 axios 的完整封装，支持单例/多例、请求去重、错误处理等

## 📁 项目结构

```
react-spa-template/
├── entry/                    # HTML 入口文件（支持未来 MPA 扩展）
│   └── index.html
├── public/                   # 静态资源
├── docs/                     # 项目文档
│   ├── PAGE_ORGANIZATION_GUIDE.md      # 页面目录组织指南
│   ├── PAGE_ORGANIZATION_EXAMPLE.md    # 页面组织示例
│   ├── COMPONENT_ORGANIZATION_GUIDE.md # 组件组织指南
│   ├── REACT_HOOKS_GUIDE.md            # React Hooks 指南（Vue 开发者）
│   ├── ZUSTAND_GUIDE.md                # Zustand 使用指南
│   ├── THEME_GUIDE.md                  # 主题配置指南
│   ├── ROUTER_V7_MIGRATION.md          # React Router v7 迁移说明
│   └── ...                             # 更多文档
├── src/
│   ├── api/                  # API 接口
│   ├── assets/               # 资源文件
│   ├── components/           # 公共组件
│   │   ├── ErrorBoundary/    # 错误边界
│   │   ├── Loading/          # 加载组件
│   │   ├── RouteError/       # 路由错误组件
│   │   └── Skeleton/          # 骨架屏
│   ├── constants/            # 常量定义
│   ├── hooks/                # 全局 Hooks
│   │   └── useRouter.ts      # 路由 Hook
│   ├── pages/                # 页面组件（按业务模块组织）
│   │   ├── Home/             # 首页模块
│   │   │   ├── index.tsx
│   │   │   ├── index.module.scss
│   │   │   ├── api.ts         # 页面级 API
│   │   │   ├── components/    # 页面专用组件
│   │   │   │   ├── HomeHeader.tsx
│   │   │   │   ├── ActionButtons.tsx
│   │   │   │   └── ...
│   │   │   └── hooks/         # 页面专用 Hooks
│   │   │       └── useAppStatus.ts
│   │   ├── User/              # 用户模块
│   │   │   └── index.tsx
│   │   ├── Article/           # 文章模块（示例：多级嵌套页面）
│   │   │   ├── List/          # 列表页（一级）
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── components/  # 列表页专用组件
│   │   │   │   ├── hooks/        # 列表页专用 Hooks
│   │   │   │   └── api.ts        # 列表页 API
│   │   │   ├── Detail/        # 详情页（二级）
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.module.scss
│   │   │   │   ├── components/  # 详情页专用组件
│   │   │   │   ├── hooks/        # 详情页专用 Hooks
│   │   │   │   └── api.ts        # 详情页 API
│   │   │   └── Edit/          # 编辑页（二级）
│   │   │       └── index.tsx
│   │   ├── User/              # 用户模块（示例：三级页面）
│   │   │   ├── Profile/       # 个人资料（一级）
│   │   │   ├── Settings/       # 设置（一级）
│   │   │   └── Orders/         # 订单模块（一级）
│   │   │       ├── List/       # 订单列表（二级）
│   │   │       │   └── index.tsx
│   │   │       └── Detail/     # 订单详情（三级）
│   │   │           ├── index.tsx
│   │   │           ├── components/
│   │   │           └── hooks/
│   │   ├── NotFound/          # 404 页面
│   │   └── ThemeDemo/          # 主题演示页
│   ├── router/                # 路由配置
│   │   ├── modules/           # 路由模块（按业务划分）
│   │   │   ├── home.ts        # 首页模块路由
│   │   │   ├── user.ts        # 用户模块路由
│   │   │   ├── theme.ts       # 主题模块路由
│   │   │   ├── index.ts       # 路由合并
│   │   │   └── README.md      # 路由模块说明
│   │   ├── guards.tsx         # 路由守卫
│   │   ├── utils.tsx          # 路由工具函数
│   │   └── index.tsx          # 路由入口
│   ├── store/                 # 状态管理（Zustand）
│   │   ├── userStore.ts       # 用户状态
│   │   └── appStore.ts        # 应用状态
│   ├── styles/                # 样式文件
│   │   ├── index.scss         # 全局样式入口
│   │   ├── reset.scss         # 样式重置
│   │   ├── variables.scss     # CSS 变量
│   │   └── theme/             # 主题样式
│   │       ├── default.scss
│   │       ├── brand1.scss
│   │       └── brand2.scss
│   ├── theme/                 # 主题管理
│   │   ├── tokens.ts          # 主题配置
│   │   ├── applyTheme.ts      # 主题应用
│   │   ├── useTheme.ts        # 主题 Hook
│   │   └── antd-overrides.scss # Ant Design 样式覆盖
│   ├── types/                 # TypeScript 类型
│   │   ├── index.ts           # 通用类型
│   │   └── global.d.ts        # 全局类型声明
│   ├── utils/                 # 工具函数
│   │   ├── http/              # HTTP 请求封装
│   │   │   ├── core.ts         # 核心工厂函数
│   │   │   ├── types.ts        # 类型定义
│   │   │   ├── constants.ts    # 常量定义
│   │   │   ├── interceptors/   # 拦截器
│   │   │   ├── transform/      # 响应/错误转换
│   │   │   ├── utils/          # 工具函数
│   │   │   ├── README.md       # HTTP 使用文档
│   │   │   └── index.ts        # 默认导出
│   │   ├── common.ts           # 通用工具
│   │   ├── format.ts           # 格式化工具
│   │   ├── validate.ts         # 验证工具
│   │   ├── storage.ts          # 存储工具
│   │   ├── env.ts              # 环境检测
│   │   ├── report.ts           # 监控上报
│   │   └── index.ts            # 工具函数统一导出
│   ├── AppRoot.tsx             # 根组件
│   └── main.tsx                # 入口文件
├── .env.example                # 环境变量示例
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── eslint.config.js            # ESLint 配置
├── postcss.config.js           # PostCSS 配置
├── vite.config.ts              # Vite 配置
└── package.json
```

> 📖 **页面目录组织**：项目采用**按业务模块嵌套组织**的目录结构，支持多级嵌套页面（详情页、编辑页等）。详细说明请参考 [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md) 和 [页面组织示例](./docs/PAGE_ORGANIZATION_EXAMPLE.md)。

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

> 📖 **快速开始指南**：更多详细信息请参考 [QUICK_START.md](./QUICK_START.md)

## 📝 环境变量

复制 `.env.example` 文件创建 `.env.local` 并根据需要修改：

```bash
cp .env.example .env.local
```

## 🔧 配置说明

### 移动端适配

项目使用 `postcss-mobile-forever` 进行移动端适配，默认设计稿宽度为 375px，可在 `postcss.config.js` 中修改。

### 路由系统

项目使用 **React Router v7**，采用**配置式路由**和**扁平路由配置**（推荐）。

- **路由配置**：在 `src/router/modules/` 下按业务模块划分路由
- **路由导航**：使用 `path` 进行导航（React Router 不支持通过 `name` 跳转）
- **路由守卫**：支持异步路由守卫
- **路由懒加载**：自动支持，无需额外配置

> 📖 **路由相关文档**：
>
> - [路由模块说明](./src/router/modules/README.md)
> - [React Router v7 迁移说明](./docs/ROUTER_V7_MIGRATION.md)
> - [路由配置方式对比](./docs/ROUTE_COMPARISON.md)

### HTTP 请求封装

项目提供了完整的 HTTP 请求封装，基于 `axios`，支持：

- ✅ 单例/多实例模式
- ✅ 请求去重（自动取消重复请求）
- ✅ 统一错误处理
- ✅ 成功/失败消息提示
- ✅ 请求/响应拦截器
- ✅ Token 自动附加
- ✅ FormData 自动处理
- ✅ 自定义超时时间
- ✅ 跳过错误处理（`skipErrorHandler`）

> 📖 **HTTP 使用文档**：详细使用说明请参考 [HTTP 使用文档](./src/utils/http/README.md)

### 状态管理（Zustand）

项目使用 **Zustand** 进行状态管理，推荐策略：

- **组件局部状态**：使用 `useState` / `useReducer`
- **跨组件/跨页面共享状态**：使用 `zustand`（`src/store` 目录）

> 📖 **Zustand 使用指南**：详细使用说明和常见陷阱请参考 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)

### 主题系统

项目支持多主题切换，可在 `src/theme/tokens.ts` 中配置主题。

> 📖 **主题配置指南**：详细说明请参考 [主题配置指南](./docs/THEME_GUIDE.md)

### 错误边界

项目已集成错误边界组件，自动捕获并处理运行时错误。

### vConsole 调试

在开发环境或设置 `VITE_VCONSOLE_ENABLED=true` 时会自动启用 vConsole 调试工具。

## 📦 工具库

- **lodash-es** - 工具函数库
- **dayjs** - 日期时间处理
- **classnames** - CSS 类名管理
- **axios** - HTTP 请求库

> 📖 **Lodash 导入指南**：按需导入最佳实践请参考 [Lodash 导入指南](./docs/LODASH_IMPORT_GUIDE.md)

## 🎯 最佳实践

1. **使用 TypeScript 确保类型安全**
2. **遵循 ESLint 和 Prettier 配置**
3. **使用路由懒加载 + Suspense + 骨架屏优化首屏体验**
4. **合理使用错误边界与监控**（`AppErrorBoundary` + `utils/report`）
5. **充分利用工具库与 http 封装提高开发效率**

### 页面组织

- **目录结构**：按业务模块嵌套组织（`pages/Article/List/`、`pages/Article/Detail/`）
- **路由配置**：使用扁平路由配置（灵活，易于调整）
- **资源内聚**：页面级资源（组件、hooks、API）放在页面目录下

> 📖 **页面组织文档**：
>
> - [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md)
> - [页面组织示例](./docs/PAGE_ORGANIZATION_EXAMPLE.md)

### 组件组织

- **容器/展示组件分离**：业务逻辑放在容器组件或自定义 Hook 中
- **页面级组件**：放在 `pages/[Module]/components/` 下
- **全局组件**：放在 `src/components/` 下

> 📖 **组件组织指南**：详细说明请参考 [组件组织指南](./docs/COMPONENT_ORGANIZATION_GUIDE.md)

### React Hooks

项目使用 React 19.2.0，支持最新的 Hooks API。

> 📖 **React Hooks 指南**：面向 Vue 开发者的 React Hooks 指南请参考 [React Hooks 指南](./docs/REACT_HOOKS_GUIDE.md)

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

这一节是从"脚手架"的视角，教你如何在此模板上快速扩展业务。

### 1. 新增一个页面（Page）

#### 简单页面（一级页面）

1. 在 `src/pages` 下创建新目录，例如 `Profile/`：
   ```bash
   src/pages/Profile/
     ├── index.tsx
     └── index.module.scss
   ```
2. 在 `index.tsx` 中编写页面组件，并引入样式：

   ```tsx
   import styles from './index.module.scss'

   export default function Profile() {
   	return <div className={styles.profilePage}>Profile Page</div>
   }
   ```

#### 嵌套页面（多级页面）

对于需要多级嵌套的页面（如列表页、详情页、编辑页），按业务模块组织：

```bash
src/pages/Article/              # 文章模块
  ├── List/                    # 列表页（一级）
  │   ├── index.tsx
  │   ├── index.module.scss
  │   ├── components/          # 列表页专用组件
  │   ├── hooks/               # 列表页专用 Hooks
  │   └── api.ts               # 列表页 API
  ├── Detail/                  # 详情页（二级）
  │   ├── index.tsx
  │   ├── components/
  │   └── hooks/
  └── Edit/                    # 编辑页（二级）
      └── index.tsx
```

> 📖 **页面组织**：详细说明请参考 [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md)

### 2. 注册路由

路由采用"模块化配置"，在 `src/router/modules` 下新增一个路由模块：

1. 新建文件 `src/router/modules/article.ts`：

   ```ts
   import type { RouteConfig } from '@/types'

   export const articleRoutes: RouteConfig[] = [
   	{
   		path: '/article', // 路由路径，用于 URL 映射和导航
   		name: 'ArticleList', // 路由名称，仅用于标识，不用于导航
   		meta: {
   			title: '文章列表',
   		},
   		component: () => import('@/pages/Article/List/index'),
   	},
   	{
   		path: '/article/:id', // 详情页路径
   		name: 'ArticleDetail',
   		meta: {
   			title: '文章详情',
   		},
   		component: () => import('@/pages/Article/Detail/index'),
   	},
   ]
   ```

2. 在 `src/router/modules/index.ts` 中汇总导出：
   ```ts
   import { articleRoutes } from './article' // 新增
   export const routeModules: RouteConfig[] = [
   	...homeRoutes,
   	...userRoutes,
   	...themeRoutes,
   	...articleRoutes, // 新增
   	// ...
   ]
   ```

> 📖 **路由配置**：详细说明请参考 [路由模块说明](./src/router/modules/README.md)

### 3. 新增一个 API 接口

1. 在页面目录下创建 `api.ts`（页面级 API）或在 `src/api/index.ts` 中补充（全局 API）：

   ```ts
   import http from '@/utils/http'

   export const getArticleList = (params: any) => {
   	return http.get('/api/article/list', { params })
   }
   ```

2. 在页面中直接调用：
   ```ts
   import { getArticleList } from './api'
   ```

> 📖 **HTTP 使用**：详细说明请参考 [HTTP 使用文档](./src/utils/http/README.md)

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

在组件中使用时建议通过"选择器"只取需要的字段，减少重渲染：

```ts
import { useUserStore } from '@/store/userStore'

const user = useUserStore(state => state.user)
const fetchCurrentUser = useUserStore(state => state.fetchCurrentUser)
```

> 📖 **Zustand 使用**：更多注意事项与踩坑提示可参考 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)。

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
3. 如果是"必需"的关键变量，可以在 `src/constants/index.ts` 中集中读取并做兜底。

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

> 📖 **主题配置**：详细说明请参考 [主题配置指南](./docs/THEME_GUIDE.md)

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

这一整套流程就是"脚手架级"的使用姿势：**新增页面 → 注册路由 → 封装 API → 使用状态管理与主题 → 通过脚本与规范收尾**。

## 📚 文档索引

### 核心文档

- [快速开始指南](./QUICK_START.md) - 项目快速上手指南
- [项目完成总结](./PROJECT_SUMMARY.md) - 项目功能总结

### 开发指南

- [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md) - 页面目录组织最佳实践
- [页面组织示例](./docs/PAGE_ORGANIZATION_EXAMPLE.md) - 多级嵌套页面示例
- [组件组织指南](./docs/COMPONENT_ORGANIZATION_GUIDE.md) - 组件组织最佳实践
- [React Hooks 指南](./docs/REACT_HOOKS_GUIDE.md) - 面向 Vue 开发者的 React Hooks 指南
- [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md) - Zustand 状态管理使用指南

### 路由相关

- [路由模块说明](./src/router/modules/README.md) - 路由模块使用说明
- [React Router v7 迁移说明](./docs/ROUTER_V7_MIGRATION.md) - React Router v7 迁移指南
- [路由配置方式对比](./docs/ROUTE_COMPARISON.md) - 路由配置方式对比分析

### HTTP 请求

- [HTTP 使用文档](./src/utils/http/README.md) - HTTP 请求封装使用文档

### 主题系统

- [主题配置指南](./docs/THEME_GUIDE.md) - 主题配置和使用指南

### 工具库

- [Lodash 导入指南](./docs/LODASH_IMPORT_GUIDE.md) - Lodash 按需导入最佳实践

### 构建与部署

- [构建命令指南](./docs/BUILD_COMMAND_GUIDE.md) - 构建命令详细说明

### React 版本

- [React 版本说明](./docs/REACT_VERSION_NOTE.md) - React 版本相关说明
- [React 19 使用指南](./docs/REACT_19_USAGE.md) - React 19 新特性使用指南

### 架构设计

- [Subpackages 架构设计](./docs/SUBPACKAGES_ARCHITECTURE.md) - Subpackages 架构设计文档

## 📄 License

MIT
