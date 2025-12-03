# 路由模块说明

## 目录结构

```
router/
├── modules/          # 路由模块目录
│   ├── home.ts      # 首页模块路由
│   ├── user.ts      # 用户模块路由
│   └── index.ts     # 路由合并导出
└── index.tsx        # 路由入口
```

## 添加新路由模块

### 1. 创建模块文件

在 `modules/` 目录下创建新的路由模块文件，例如 `member.ts`：

```typescript
// src/router/modules/member.ts
import type { RouteConfig } from '@/types'

export const memberRoutes: RouteConfig[] = [
	{
		path: '/member',
		name: 'MemberHome',
		meta: {
			title: '会员中心',
			requiresAuth: true,
		},
		component: () => import('@/pages/Member/Home/index'),
		guard: async () => {
			// 路由守卫逻辑
			return true
		},
	},
	{
		path: '/member/profile',
		name: 'MemberProfile',
		meta: {
			title: '个人资料',
			requiresAuth: true,
		},
		component: () => import('@/pages/Member/Profile/index'),
	},
]
```

### 2. 在 index.ts 中导入并合并

```typescript
// src/router/modules/index.ts
import { homeRoutes } from './home'
import { userRoutes } from './user'
import { memberRoutes } from './member' // 新增
import type { RouteConfig } from '@/types'

export const routeModules: RouteConfig[] = [
	...homeRoutes,
	...userRoutes,
	...memberRoutes, // 新增
	// 404 重定向（必须放在最后）
	{
		path: '*',
		redirect: '/',
	},
]
```

## 路由配置说明

### 基本配置

```typescript
{
  path: '/path',           // 路由路径
  name: 'RouteName',      // 路由名称（可选）
  meta: {                 // 路由元信息（可选）
    title: '页面标题',
    requiresAuth: true,
    innerPage: true,
  },
  component: () => import('@/pages/Page/index'),  // 懒加载组件
  guard: async () => {    // 路由守卫（可选）
    // 返回 true 允许访问，false 阻止访问
    return true
  },
}
```

### 重定向路由

```typescript
{
  path: '/old-path',
  redirect: '/new-path',  // 重定向到新路径
}
```

## 最佳实践

1. **按业务模块划分**：每个业务模块一个路由文件
2. **统一命名规范**：路由名称使用 PascalCase
3. **路由守卫**：需要权限控制的路由统一配置 guard
4. **404 处理**：在 `index.ts` 最后添加通配符路由

## 未来扩展

当项目扩展为 Subpackages 架构时，可以将路由模块迁移到对应的包中：

```
src/
├── packages/
│   ├── main/
│   │   └── router/
│   │       └── index.ts    # 主应用路由
│   ├── member/
│   │   └── router/
│   │       └── index.ts    # 会员模块路由
│   └── admin/
│       └── router/
│           └── index.ts    # 管理后台路由
└── router/
    └── modules/
        └── index.ts        # 合并所有包的路由
```

详细说明请参考：[Subpackages 架构设计文档](../../../docs/SUBPACKAGES_ARCHITECTURE.md)
