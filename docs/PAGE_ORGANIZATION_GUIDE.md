# 页面目录组织最佳实践

> 本文档说明在 React 项目中如何组织页面目录结构，特别是嵌套页面（详情页、二级/三级页面）的组织方式。

## 核心原则

### 1. 按业务模块组织（推荐）✅

**原则**：同一业务模块的页面放在同一个目录下，通过子目录区分不同层级。

```
pages/
├── Article/              # 文章模块
│   ├── List/            # 列表页
│   │   ├── index.tsx
│   │   └── index.module.scss
│   ├── Detail/          # 详情页
│   │   ├── index.tsx
│   │   ├── components/  # 详情页专用组件
│   │   └── hooks/       # 详情页专用 hooks
│   └── Edit/            # 编辑页
│       └── index.tsx
├── User/                # 用户模块
│   ├── Profile/        # 个人资料
│   ├── Settings/        # 设置
│   └── Orders/          # 订单列表
│       ├── List/
│       └── Detail/      # 订单详情（三级页面）
└── Home/
    └── index.tsx
```

**优点**：

- 业务模块清晰，易于维护
- 相关页面聚合在一起
- 便于代码复用（组件、hooks、工具函数）

### 2. 扁平化组织（不推荐用于嵌套页面）❌

```
pages/
├── ArticleList.tsx
├── ArticleDetail.tsx
├── ArticleEdit.tsx
└── UserProfile.tsx
```

**缺点**：

- 页面多时难以管理
- 相关页面分散，不易查找
- 不利于代码复用

## 业界实践对比

### Next.js（文件系统路由）

Next.js 使用文件系统路由，目录结构直接映射路由：

```
pages/
├── index.tsx           → /
├── article/
│   ├── index.tsx       → /article
│   ├── [id].tsx        → /article/:id
│   └── [id]/
│       └── edit.tsx    → /article/:id/edit
```

**特点**：目录结构 = 路由结构

### Remix（文件系统路由）

类似 Next.js，但更灵活：

```
app/
├── routes/
│   ├── _index.tsx      → /
│   ├── article.tsx     → /article
│   └── article.$id.tsx → /article/:id
```

### Ant Design Pro（配置式路由）

使用配置式路由，但页面组织按业务模块：

```
src/
├── pages/
│   ├── list/
│   │   ├── table-list/
│   │   └── basic-list/
│   └── profile/
│       ├── basic/
│       └── advanced/
└── config/
    └── routes.ts        # 路由配置
```

## 推荐方案：目录嵌套 + 路由扁平

### 核心原则

**目录结构**：按业务模块嵌套组织（便于代码管理和复用）
**路由配置**：使用扁平配置（灵活，便于调整）

### 目录结构示例

```
pages/
├── Article/                    # 文章模块
│   ├── List/                  # 列表页（一级）
│   │   ├── index.tsx
│   │   ├── components/        # 列表页专用组件
│   │   │   ├── ArticleCard.tsx
│   │   │   └── FilterBar.tsx
│   │   ├── hooks/             # 列表页专用 hooks
│   │   │   └── useArticleList.ts
│   │   └── api.ts             # 列表页 API
│   │
│   ├── Detail/                # 详情页（二级）
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── CommentList.tsx
│   │   │   └── RelatedArticles.tsx
│   │   ├── hooks/
│   │   │   └── useArticleDetail.ts
│   │   └── api.ts
│   │
│   └── Edit/                  # 编辑页（二级）
│       ├── index.tsx
│       └── components/
│
├── User/                      # 用户模块
│   ├── Profile/              # 个人资料（一级）
│   ├── Settings/             # 设置（一级）
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── BasicSettings.tsx
│   │       └── SecuritySettings.tsx
│   │
│   └── Orders/               # 订单模块（一级）
│       ├── List/            # 订单列表（二级）
│       │   └── index.tsx
│       └── Detail/          # 订单详情（三级）
│           ├── index.tsx
│           └── components/
│               ├── OrderInfo.tsx
│               └── OrderItems.tsx
│
└── Home/
    └── index.tsx
```

### 路由配置方式

#### 方式一：扁平路由配置（✅ 推荐）

```typescript
// router/modules/article.ts
export const articleRoutes: RouteConfig[] = [
	{
		path: '/article',
		name: 'ArticleList',
		component: () => import('@/pages/Article/List/index'),
	},
	{
		path: '/article/:id',
		name: 'ArticleDetail',
		component: () => import('@/pages/Article/Detail/index'),
	},
	{
		path: '/article/:id/edit',
		name: 'ArticleEdit',
		component: () => import('@/pages/Article/Edit/index'),
	},
]
```

**优点**：

- 配置简单直观，路径清晰
- **灵活性强**：页面层级调整时，路由配置变化小
- **易于维护**：不需要考虑嵌套关系，每个路由独立配置
- 适合大多数场景

**推荐使用**：扁平路由配置是默认推荐方式

#### 方式二：嵌套路由配置（仅在需要共享布局时使用）

```typescript
// router/modules/article.ts
export const articleRoutes: RouteConfig[] = [
	{
		path: '/article',
		name: 'Article',
		// 可以设置 Layout 组件
		children: [
			{
				path: '', // 相对路径，实际是 /article
				name: 'ArticleList',
				component: () => import('@/pages/Article/List/index'),
			},
			{
				path: ':id', // 相对路径，实际是 /article/:id
				name: 'ArticleDetail',
				component: () => import('@/pages/Article/Detail/index'),
			},
			{
				path: ':id/edit', // 相对路径，实际是 /article/:id/edit
				name: 'ArticleEdit',
				component: () => import('@/pages/Article/Edit/index'),
			},
		],
	},
]
```

**优点**：

- 可以设置父级 Layout（如面包屑、导航）
- 路由层级清晰

**缺点**：

- **灵活性差**：页面层级调整时，嵌套结构需要重构
- 配置复杂，需要理解嵌套关系

**使用场景**：仅在需要共享布局时使用（如所有文章相关页面都需要相同的侧边栏、面包屑等）

**示例：带 Layout 的嵌套路由**

```typescript
// router/modules/article.ts
export const articleRoutes: RouteConfig[] = [
  {
    path: '/article',
    name: 'Article',
    // 父级 Layout 组件
    element: <ArticleLayout />,  // 包含面包屑、侧边栏等
    children: [
      {
        path: '',
        component: () => import('@/pages/Article/List/index'),
      },
      {
        path: ':id',
        component: () => import('@/pages/Article/Detail/index'),
      },
    ],
  },
]
```

## 实际案例：订单模块（三级页面）

### 目录结构

```
pages/
└── User/
    └── Orders/              # 订单模块
        ├── List/           # 订单列表（/user/orders）
        │   ├── index.tsx
        │   └── components/
        │       └── OrderCard.tsx
        └── Detail/         # 订单详情（/user/orders/:id）
            ├── index.tsx
            ├── components/
            │   ├── OrderHeader.tsx
            │   ├── OrderItems.tsx
            │   └── OrderActions.tsx
            ├── hooks/
            │   └── useOrderDetail.ts
            └── api.ts
```

### 路由配置

```typescript
// router/modules/user.ts
export const userRoutes: RouteConfig[] = [
	{
		path: '/user',
		name: 'User',
		children: [
			{
				path: 'profile',
				name: 'UserProfile',
				component: () => import('@/pages/User/Profile/index'),
			},
			{
				path: 'orders', // /user/orders
				name: 'UserOrders',
				children: [
					{
						path: '', // /user/orders
						name: 'OrderList',
						component: () => import('@/pages/User/Orders/List/index'),
					},
					{
						path: ':id', // /user/orders/:id
						name: 'OrderDetail',
						component: () => import('@/pages/User/Orders/Detail/index'),
					},
				],
			},
		],
	},
]
```

## 命名规范

### 页面目录命名

| 页面类型   | 命名规范          | 示例              |
| ---------- | ----------------- | ----------------- |
| **列表页** | `List` 或 `Index` | `Article/List/`   |
| **详情页** | `Detail`          | `Article/Detail/` |
| **编辑页** | `Edit` 或 `Form`  | `Article/Edit/`   |
| **创建页** | `Create` 或 `Add` | `Article/Create/` |
| **设置页** | `Settings`        | `User/Settings/`  |

### 路由路径命名

| 路由层级 | 路径示例            | 说明     |
| -------- | ------------------- | -------- |
| **一级** | `/article`          | 列表页   |
| **二级** | `/article/:id`      | 详情页   |
| **三级** | `/article/:id/edit` | 编辑页   |
| **三级** | `/user/orders/:id`  | 订单详情 |

## 决策树

```
默认使用扁平路由配置 ✅

页面是否需要共享布局？
├─ 是 → 考虑使用嵌套路由配置（children）
│      └─ 设置父级 element（Layout 组件）
│      ⚠️ 注意：这会降低灵活性，页面层级调整时需要重构路由
│
└─ 否 → 使用扁平路由配置（推荐）
       └─ 路径体现层级关系（/article/:id）
```

## 推荐实践总结

### ✅ 推荐做法（默认）

**目录结构**：按业务模块嵌套

```
pages/Article/List/
pages/Article/Detail/
pages/Article/Edit/
```

**路由配置**：扁平配置

```typescript
export const articleRoutes: RouteConfig[] = [
	{ path: '/article', component: () => import('@/pages/Article/List/index') },
	{ path: '/article/:id', component: () => import('@/pages/Article/Detail/index') },
	{ path: '/article/:id/edit', component: () => import('@/pages/Article/Edit/index') },
]
```

**优点**：

- 目录结构清晰，便于代码管理
- 路由配置灵活，易于调整
- 页面层级变化时，路由配置改动小

## 最佳实践总结

### ✅ 推荐做法（默认方案）

1. **目录结构：按业务模块嵌套组织**

```
pages/Article/List/
pages/Article/Detail/
pages/Article/Edit/
```

2. **路由配置：使用扁平配置（默认）**

```typescript
// ✅ 推荐：扁平配置
export const articleRoutes: RouteConfig[] = [
	{ path: '/article', component: () => import('@/pages/Article/List/index') },
	{ path: '/article/:id', component: () => import('@/pages/Article/Detail/index') },
	{ path: '/article/:id/edit', component: () => import('@/pages/Article/Edit/index') },
]
```

**为什么推荐扁平配置？**

- ✅ 灵活性强：页面层级调整时，路由配置变化小
- ✅ 易于维护：每个路由独立配置，不需要考虑嵌套关系
- ✅ 配置简单：路径清晰，一目了然

3. **仅在需要共享布局时使用嵌套路由**

```typescript
// ⚠️ 仅在需要共享布局时使用
{
  path: '/article',
  element: <ArticleLayout />,  // 所有文章页面共享的布局
  children: [
    { path: '', component: ... },
    { path: ':id', component: ... },
  ]
}
```

4. **页面级资源内聚**

```
Article/Detail/
├── index.tsx
├── components/    # 详情页专用组件
├── hooks/         # 详情页专用 hooks
└── api.ts         # 详情页 API
```

### ❌ 避免的做法

1. **过度扁平化**

   ```
   pages/ArticleList.tsx
   pages/ArticleDetail.tsx
   ```

2. **目录结构与路由不匹配**

   ```
   pages/Article/Detail/  → 路由：/detail  ❌
   ```

3. **跨模块的页面混在一起**
   ```
   pages/ArticleDetail/
   pages/UserDetail/      ❌ 应该分别在各自模块下
   ```

## 完整示例：文章模块

### 目录结构

```
pages/Article/
├── List/
│   ├── index.tsx
│   ├── components/
│   │   ├── ArticleCard.tsx
│   │   └── FilterBar.tsx
│   ├── hooks/
│   │   └── useArticleList.ts
│   └── api.ts
│
├── Detail/
│   ├── index.tsx
│   ├── components/
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleContent.tsx
│   │   └── CommentSection.tsx
│   ├── hooks/
│   │   └── useArticleDetail.ts
│   └── api.ts
│
└── Edit/
    ├── index.tsx
    └── components/
        └── ArticleForm.tsx
```

### 路由配置

```typescript
// router/modules/article.ts
import type { RouteConfig } from '@/types'
import { ROUTE_PATH } from '@/constants'

export const articleRoutes: RouteConfig[] = [
	{
		path: ROUTE_PATH.ARTICLE_LIST, // '/article'
		name: 'ArticleList',
		meta: {
			title: '文章列表',
		},
		component: () => import('@/pages/Article/List/index'),
	},
	{
		path: ROUTE_PATH.ARTICLE_DETAIL, // '/article/:id'
		name: 'ArticleDetail',
		meta: {
			title: '文章详情',
		},
		component: () => import('@/pages/Article/Detail/index'),
	},
	{
		path: ROUTE_PATH.ARTICLE_EDIT, // '/article/:id/edit'
		name: 'ArticleEdit',
		meta: {
			title: '编辑文章',
			requiresAuth: true,
		},
		component: () => import('@/pages/Article/Edit/index'),
		guard: async () => {
			// 检查编辑权限
			return true
		},
	},
]
```

### 常量定义

```typescript
// constants/index.ts
export const ROUTE_PATH = {
	HOME: '/',
	USER: '/user',
	ARTICLE_LIST: '/article',
	ARTICLE_DETAIL: '/article/:id',
	ARTICLE_EDIT: '/article/:id/edit',
	// ...
} as const
```

## 总结

### 核心原则

1. **目录结构**：按业务模块嵌套组织（`pages/Article/List/`、`pages/Article/Detail/`）
2. **路由配置**：默认使用扁平配置（灵活，易于调整）
3. **共享布局**：仅在需要时使用嵌套路由配置
4. **资源内聚**：页面级资源（组件、hooks、API）放在页面目录下

### 推荐方案对比

| 维度         | 目录结构           | 路由配置         |
| ------------ | ------------------ | ---------------- |
| **组织方式** | 嵌套（按业务模块） | 扁平（独立配置） |
| **灵活性**   | 高（便于代码管理） | 高（易于调整）   |
| **维护性**   | 高（相关页面聚合） | 高（配置简单）   |
| **适用场景** | 所有场景           | 默认方案         |

**核心思想**：

- 目录结构 = 业务模块结构（便于代码组织）
- 路由配置 = 扁平独立（便于灵活调整）

这样既保持了代码的组织性，又保证了路由配置的灵活性。

### 推荐结构

```
pages/
└── [Module]/          # 业务模块
    ├── List/          # 列表页
    ├── Detail/        # 详情页（二级）
    └── [SubModule]/   # 子模块
        └── Detail/    # 详情页（三级）
```

这样既保持了代码的组织性，又便于维护和扩展。
