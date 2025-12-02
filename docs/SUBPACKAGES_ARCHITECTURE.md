# Subpackages 架构设计文档

## 概述

本文档说明如何将当前 SPA 项目重构为支持 subpackages（子包/分包）的架构，实现按业务模块进行代码分割和独立部署。

## 目录结构设计

### 当前结构（SPA 单包）

```
react-spa-template/
├── entry/
│   └── index.html              # 主入口 HTML
├── src/
│   ├── pages/                  # 页面组件（扁平结构）
│   │   ├── Home/
│   │   └── User/
│   ├── router/                 # 路由配置
│   │   ├── modules/            # 路由模块
│   │   │   ├── home.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── index.tsx
│   ├── components/             # 公共组件
│   ├── utils/                  # 工具函数
│   └── ...
└── ...
```

### 重构后结构（支持 Subpackages）

```
react-spa-template/
├── entry/                      # HTML 入口文件
│   ├── index.html              # 主应用入口
│   ├── member.html             # 会员模块入口（可选）
│   └── admin.html              # 管理后台入口（可选）
├── src/
│   ├── packages/               # 业务包目录（按业务划分）
│   │   ├── main/               # 主应用包
│   │   │   ├── pages/          # 主应用页面
│   │   │   │   ├── Home/
│   │   │   │   └── Dashboard/
│   │   │   ├── router/         # 主应用路由
│   │   │   │   └── index.ts
│   │   │   └── components/     # 主应用专用组件（可选）
│   │   │
│   │   ├── member/             # 会员模块包
│   │   │   ├── pages/          # 会员模块页面
│   │   │   │   ├── MemberHome/
│   │   │   │   ├── MemberProfile/
│   │   │   │   └── MemberOrders/
│   │   │   ├── router/         # 会员模块路由
│   │   │   │   └── index.ts
│   │   │   └── components/     # 会员模块专用组件
│   │   │
│   │   └── admin/              # 管理后台包
│   │       ├── pages/          # 管理后台页面
│   │       │   ├── AdminHome/
│   │       │   ├── AdminUsers/
│   │       │   └── AdminSettings/
│   │       ├── router/         # 管理后台路由
│   │       │   └── index.ts
│   │       └── components/     # 管理后台专用组件
│   │
│   ├── shared/                 # 共享代码（所有包共用）
│   │   ├── components/         # 公共组件
│   │   │   ├── ErrorBoundary/
│   │   │   ├── Loading/
│   │   │   └── Skeleton/
│   │   ├── utils/              # 工具函数
│   │   │   ├── request.ts
│   │   │   ├── storage.ts
│   │   │   └── ...
│   │   ├── api/                # API 接口
│   │   ├── types/              # 类型定义
│   │   ├── constants/          # 常量
│   │   ├── styles/             # 全局样式
│   │   └── assets/             # 静态资源
│   │
│   ├── router/                 # 全局路由配置（SPA 模式）
│   │   ├── modules/            # 路由模块（按业务划分）
│   │   │   ├── main.ts         # 主应用路由
│   │   │   ├── member.ts      # 会员模块路由
│   │   │   ├── admin.ts       # 管理后台路由
│   │   │   └── index.ts       # 路由合并
│   │   └── index.tsx           # 路由入口
│   │
│   └── apps/                   # 应用入口（MPA 模式使用）
│       ├── main.tsx            # 主应用入口
│       ├── member.tsx          # 会员模块入口
│       └── admin.tsx          # 管理后台入口
```

## 两种模式对比

### 模式一：SPA 单包模式（当前）

**特点**：
- 所有业务模块在一个应用中
- 共享路由配置
- 代码按需懒加载
- 适合中小型项目

**路由配置**：
```typescript
// src/router/modules/index.ts
export const routeModules = [
  ...mainRoutes,    // 主应用路由
  ...memberRoutes,  // 会员模块路由
  ...adminRoutes,   // 管理后台路由
]
```

### 模式二：Subpackages 多包模式（未来扩展）

**特点**：
- 每个业务模块独立打包
- 可以独立部署
- 更好的代码隔离
- 适合大型项目

**路由配置**：
```typescript
// src/packages/main/router/index.ts
export const mainRoutes = [
  // 主应用路由
]

// src/packages/member/router/index.ts
export const memberRoutes = [
  // 会员模块路由
]
```

## 迁移步骤

### 阶段一：模块化路由（当前）

1. ✅ 路由按模块拆分到 `router/modules/`
2. ✅ 每个模块独立管理路由配置
3. ✅ 统一合并路由

### 阶段二：页面模块化（推荐）

1. 创建 `src/packages/` 目录
2. 按业务划分页面到不同包
3. 保持共享代码在 `src/shared/`
4. 更新路由配置引用路径

**示例迁移**：
```typescript
// 迁移前
component: () => import('@/pages/User/index')

// 迁移后
component: () => import('@/packages/main/pages/User/index')
```

### 阶段三：Subpackages 独立打包（可选）

1. 配置 Vite 多入口打包
2. 每个包独立构建
3. 可以独立部署

## 路径别名配置

### 当前配置（tsconfig.json & vite.config.ts）

```typescript
{
  '@': 'src',
  '@/pages': 'src/pages',
  '@/components': 'src/components',
  // ...
}
```

### 重构后配置

```typescript
{
  '@': 'src',
  '@shared': 'src/shared',
  '@main': 'src/packages/main',
  '@member': 'src/packages/member',
  '@admin': 'src/packages/admin',
  // 保持向后兼容
  '@/pages': 'src/packages/main/pages',  // 默认指向主应用
  '@/components': 'src/shared/components',
}
```

## 路由模块化示例

### 主应用路由模块

```typescript
// src/router/modules/main.ts
import type { RouteConfig } from '@/types'

export const mainRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '首页' },
    component: () => import('@main/pages/Home/index'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '仪表盘', requiresAuth: true },
    component: () => import('@main/pages/Dashboard/index'),
  },
]
```

### 会员模块路由

```typescript
// src/router/modules/member.ts
import type { RouteConfig } from '@/types'

export const memberRoutes: RouteConfig[] = [
  {
    path: '/member',
    name: 'MemberHome',
    meta: { title: '会员中心', requiresAuth: true },
    component: () => import('@member/pages/MemberHome/index'),
  },
  {
    path: '/member/profile',
    name: 'MemberProfile',
    meta: { title: '个人资料', requiresAuth: true },
    component: () => import('@member/pages/MemberProfile/index'),
  },
]
```

## 代码分割策略

### SPA 模式

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router-vendor': ['react-router', 'react-router-dom'],
        'main': ['./src/packages/main'],
        'member': ['./src/packages/member'],
        'admin': ['./src/packages/admin'],
      },
    },
  },
}
```

### MPA 模式

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'entry/index.html'),
      member: resolve(__dirname, 'entry/member.html'),
      admin: resolve(__dirname, 'entry/admin.html'),
    },
  },
}
```

## 最佳实践

### 1. 共享代码原则

- **放在 `shared/`**：工具函数、公共组件、类型定义、API 接口
- **放在包内**：业务特定的组件、页面、路由

### 2. 依赖管理

- 共享依赖放在根目录 `package.json`
- 包特定依赖可以独立管理（如果使用 monorepo）

### 3. 路由命名规范

- 主应用：`/`, `/dashboard`, `/settings`
- 会员模块：`/member/*`
- 管理后台：`/admin/*`

### 4. 类型定义

```typescript
// src/shared/types/packages.ts
export interface PackageConfig {
  name: string
  path: string
  routes: RouteConfig[]
}

// src/shared/types/index.ts
export * from './packages'
```

## 迁移检查清单

- [ ] 创建 `src/packages/` 目录结构
- [ ] 创建 `src/shared/` 目录结构
- [ ] 迁移页面到对应包
- [ ] 迁移共享代码到 `shared/`
- [ ] 更新路由配置路径
- [ ] 更新路径别名配置
- [ ] 更新导入路径
- [ ] 测试路由功能
- [ ] 测试代码分割
- [ ] 更新构建配置

## 总结

1. **当前阶段**：路由模块化已完成，页面可以逐步迁移
2. **推荐做法**：先完成页面模块化，再考虑 subpackages 独立打包
3. **架构优势**：清晰的业务边界，便于团队协作和维护
4. **扩展性**：支持从 SPA 平滑过渡到 MPA

