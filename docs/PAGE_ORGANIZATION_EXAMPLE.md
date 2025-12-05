# 页面组织示例：文章模块（嵌套页面）

> 本文档提供一个完整的示例，展示如何组织嵌套页面（列表页、详情页、编辑页）的目录结构和路由配置。

## 目录结构

```
pages/
└── Article/                    # 文章模块
    ├── List/                  # 列表页（一级页面）
    │   ├── index.tsx
    │   ├── index.module.scss
    │   ├── components/        # 列表页专用组件
    │   │   ├── ArticleCard.tsx
    │   │   ├── ArticleCard.module.scss
    │   │   ├── FilterBar.tsx
    │   │   └── index.ts
    │   ├── hooks/             # 列表页专用 hooks
    │   │   ├── useArticleList.ts
    │   │   └── index.ts
    │   └── api.ts             # 列表页 API
    │
    ├── Detail/                # 详情页（二级页面）
    │   ├── index.tsx
    │   ├── index.module.scss
    │   ├── components/
    │   │   ├── ArticleHeader.tsx
    │   │   ├── ArticleContent.tsx
    │   │   ├── CommentSection.tsx
    │   │   └── index.ts
    │   ├── hooks/
    │   │   ├── useArticleDetail.ts
    │   │   └── index.ts
    │   └── api.ts
    │
    └── Edit/                  # 编辑页（二级页面）
        ├── index.tsx
        ├── index.module.scss
        ├── components/
        │   └── ArticleForm.tsx
        └── hooks/
            └── useArticleForm.ts
```

## 路由配置

### 方式一：扁平路由配置（✅ 推荐，默认方案）

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
			innerPage: false,
		},
		component: () => import('@/pages/Article/List/index'),
	},
	{
		path: ROUTE_PATH.ARTICLE_DETAIL, // '/article/:id'
		name: 'ArticleDetail',
		meta: {
			title: '文章详情',
			innerPage: true,
		},
		component: () => import('@/pages/Article/Detail/index'),
	},
	{
		path: ROUTE_PATH.ARTICLE_EDIT, // '/article/:id/edit'
		name: 'ArticleEdit',
		meta: {
			title: '编辑文章',
			innerPage: true,
			requiresAuth: true,
		},
		component: () => import('@/pages/Article/Edit/index'),
		guard: async () => {
			// 检查编辑权限
			const token = localStorage.getItem('token')
			return !!token
		},
	},
]
```

### 方式二：嵌套路由配置（⚠️ 仅在需要共享布局时使用）

```typescript
// router/modules/article.ts
import type { RouteConfig } from '@/types'
import { ROUTE_PATH } from '@/constants'
import { ArticleLayout } from '@/pages/Article/components/ArticleLayout'

export const articleRoutes: RouteConfig[] = [
	{
		path: ROUTE_PATH.ARTICLE_LIST, // '/article'
		name: 'Article',
		// 如果需要共享布局，可以设置 element
		// element: <ArticleLayout />,
		children: [
			{
				path: '', // 相对路径，实际是 /article
				name: 'ArticleList',
				meta: {
					title: '文章列表',
				},
				component: () => import('@/pages/Article/List/index'),
			},
			{
				path: ':id', // 相对路径，实际是 /article/:id
				name: 'ArticleDetail',
				meta: {
					title: '文章详情',
				},
				component: () => import('@/pages/Article/Detail/index'),
			},
			{
				path: ':id/edit', // 相对路径，实际是 /article/:id/edit
				name: 'ArticleEdit',
				meta: {
					title: '编辑文章',
					requiresAuth: true,
				},
				component: () => import('@/pages/Article/Edit/index'),
				guard: async () => {
					const token = localStorage.getItem('token')
					return !!token
				},
			},
		],
	},
]
```

## 页面实现示例

### Article/List/index.tsx

```tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, PageSkeleton } from '@/components'
import { ArticleCard } from './components'
import { useArticleList } from './hooks'
import { ROUTE_PATH } from '@/constants'
import styles from './index.module.scss'

export default function ArticleList() {
	const navigate = useNavigate()
	const { articles, loading, fetchArticles } = useArticleList()

	useEffect(() => {
		fetchArticles()
	}, [])

	const handleCardClick = (id: string) => {
		navigate(ROUTE_PATH.ARTICLE_DETAIL.replace(':id', id))
	}

	if (loading) {
		return <PageSkeleton rows={5} />
	}

	return (
		<div className={styles.list}>
			<List>
				{articles.map(article => (
					<ArticleCard key={article.id} article={article} onClick={() => handleCardClick(article.id)} />
				))}
			</List>
		</div>
	)
}
```

### Article/Detail/index.tsx

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { Button, PageSkeleton } from '@/components'
import { ArticleHeader, ArticleContent, CommentSection } from './components'
import { useArticleDetail } from './hooks'
import { ROUTE_PATH } from '@/constants'
import styles from './index.module.scss'

export default function ArticleDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { article, loading, fetchArticle } = useArticleDetail()

	useEffect(() => {
		if (id) {
			fetchArticle(id)
		}
	}, [id])

	const handleEdit = () => {
		navigate(ROUTE_PATH.ARTICLE_EDIT.replace(':id', id!))
	}

	if (loading) {
		return <PageSkeleton rows={5} />
	}

	if (!article) {
		return <div>文章不存在</div>
	}

	return (
		<div className={styles.detail}>
			<ArticleHeader article={article} />
			<ArticleContent content={article.content} />
			<CommentSection articleId={article.id} />
			<Button onClick={handleEdit}>编辑</Button>
		</div>
	)
}
```

## 路由常量定义

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

## 三级页面示例：订单详情

### 目录结构

```
pages/
└── User/
    └── Orders/              # 订单模块
        ├── List/           # 订单列表（/user/orders）
        │   └── index.tsx
        └── Detail/         # 订单详情（/user/orders/:id）
            ├── index.tsx
            ├── components/
            │   ├── OrderHeader.tsx
            │   ├── OrderItems.tsx
            │   └── OrderActions.tsx
            └── hooks/
                └── useOrderDetail.ts
```

### 路由配置

```typescript
// router/modules/user.ts
export const userRoutes: RouteConfig[] = [
	{
		path: ROUTE_PATH.USER, // '/user'
		name: 'User',
		children: [
			{
				path: 'profile', // '/user/profile'
				name: 'UserProfile',
				component: () => import('@/pages/User/Profile/index'),
			},
			{
				path: 'orders', // '/user/orders'
				name: 'UserOrders',
				children: [
					{
						path: '', // '/user/orders'
						name: 'OrderList',
						component: () => import('@/pages/User/Orders/List/index'),
					},
					{
						path: ':id', // '/user/orders/:id'
						name: 'OrderDetail',
						component: () => import('@/pages/User/Orders/Detail/index'),
					},
				],
			},
		],
	},
]
```

## 总结

### 推荐做法（默认方案）

1. **目录结构**：`pages/[Module]/[Page]/`（按业务模块嵌套组织）
2. **路由配置**：**默认使用扁平配置**
   - ✅ 扁平配置：灵活，易于调整（推荐）
   - ⚠️ 嵌套配置：仅在需要共享布局时使用
3. **资源内聚**：页面级资源放在页面目录下

### 为什么推荐扁平路由配置？

**优点**：

- ✅ **灵活性强**：页面层级调整时，路由配置变化小
- ✅ **易于维护**：每个路由独立配置，不需要考虑嵌套关系
- ✅ **配置简单**：路径清晰，一目了然

**示例**：

```typescript
// 扁平配置：页面层级调整时，只需要修改路径，不需要重构嵌套结构
{ path: '/article', ... }
{ path: '/article/:id', ... }
{ path: '/article/:id/edit', ... }

// 嵌套配置：页面层级调整时，需要重构整个嵌套结构
{
  path: '/article',
  children: [
    { path: '', ... },
    { path: ':id', ... },
  ]
}
```

### 路径映射关系

| 目录结构                    | 路由路径            | 说明             |
| --------------------------- | ------------------- | ---------------- |
| `pages/Article/List/`       | `/article`          | 列表页           |
| `pages/Article/Detail/`     | `/article/:id`      | 详情页（二级）   |
| `pages/Article/Edit/`       | `/article/:id/edit` | 编辑页（二级）   |
| `pages/User/Orders/Detail/` | `/user/orders/:id`  | 订单详情（三级） |

这样既保持了代码的组织性，又便于维护和扩展。
