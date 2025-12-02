# React Router v7 迁移说明

## 概述

项目已从 React Router v6 的组件式写法迁移到 v7 的 `createHashRouter` 现代写法，以支持 v7 的新特性。

## 主要变更

### 1. 路由创建方式

**之前（v6 组件式）**：
```tsx
<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</HashRouter>
```

**现在（v7 配置式）**：
```tsx
import { createHashRouter } from 'react-router-dom'

export const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
])
```

### 2. 入口文件变更

**之前**：
```tsx
// main.tsx
<App />  // App 组件中包含 HashRouter

// App.tsx
<HashRouter>
  <Routes>...</Routes>
</HashRouter>
```

**现在**：
```tsx
// main.tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

<RouterProvider router={router} />
```

### 3. 路由守卫改进

**之前**：使用 `useEffect` 异步检查，可能导致闪烁
```tsx
function RouteGuard({ children, route }) {
  const [allowed, setAllowed] = useState(null)
  useEffect(() => {
    // 异步检查
  }, [])
  // ...
}
```

**现在**：使用 Layout Wrapper + `<Outlet />`，同步判断
```tsx
function AuthGuard() {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />  // 渲染子路由
}
```

## 新特性支持

### 1. Loader（数据预加载）

```typescript
{
  path: '/user/:id',
  component: () => import('@/pages/User/index'),
  loader: async ({ params }) => {
    // 路由加载前预取数据
    const user = await fetchUser(params.id)
    return { user }
  },
}
```

在组件中使用：
```tsx
import { useLoaderData } from 'react-router-dom'

function User() {
  const { user } = useLoaderData()
  // ...
}
```

### 2. Action（表单提交处理）

```typescript
{
  path: '/user/edit',
  component: () => import('@/pages/User/Edit'),
  action: async ({ request }) => {
    const formData = await request.formData()
    // 处理表单提交
    await updateUser(formData)
    return redirect('/user')
  },
}
```

### 3. 更好的 ScrollRestoration

v7 自动处理滚动位置恢复，无需手动配置。

## 目录结构

```
src/router/
├── guards.tsx        # 路由守卫组件
├── utils.tsx         # 路由配置转换工具
├── modules/          # 路由模块（按业务划分）
│   ├── home.ts
│   ├── user.ts
│   └── index.ts
└── index.tsx         # 路由入口（使用 createHashRouter）
```

## 使用示例

### 添加新路由（支持 v7 特性）

```typescript
// router/modules/member.ts
export const memberRoutes: RouteConfig[] = [
  {
    path: '/member',
    name: 'MemberHome',
    meta: { title: '会员中心', requiresAuth: true },
    component: () => import('@/pages/Member/Home/index'),
    // v7 新特性：数据预加载
    loader: async () => {
      const memberInfo = await fetchMemberInfo()
      return { memberInfo }
    },
    // 路由守卫
    guard: async () => {
      const token = localStorage.getItem('token')
      return !!token
    },
  },
]
```

### 在组件中使用 Loader 数据

```tsx
import { useLoaderData } from 'react-router-dom'

export default function MemberHome() {
  const { memberInfo } = useLoaderData()
  // ...
}
```

## 优势

1. **支持 v7 新特性**：Loader、Action、更好的 ScrollRestoration
2. **更好的性能**：路由守卫同步判断，避免闪烁
3. **解耦渲染与逻辑**：路由定义为纯数据结构，逻辑更清晰
4. **类型安全**：完整的 TypeScript 支持
5. **模块化**：路由按业务模块拆分，便于维护

## 注意事项

1. **路由配置**：现在使用配置对象数组，而不是 JSX 组件
2. **路由守卫**：推荐使用 Layout Wrapper 方式，而不是在组件内使用 useEffect
3. **数据加载**：使用 `loader` 而不是在组件 `useEffect` 中加载
4. **表单提交**：使用 `action` 处理表单提交，而不是在组件中处理

## 迁移检查清单

- [x] 使用 `createHashRouter` 创建路由
- [x] 使用 `RouterProvider` 挂载路由
- [x] 路由守卫改为 Layout Wrapper
- [x] 支持 `loader` 和 `action`
- [x] 保持模块化路由结构
- [x] 保持懒加载功能
- [x] 保持路由元信息支持

## 参考文档

- [React Router v7 官方文档](https://reactrouter.com/)
- [Data API 文档](https://reactrouter.com/en/main/route/loader)
- [Migration Guide](https://reactrouter.com/en/main/upgrading/v6)

