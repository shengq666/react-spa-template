# React 19 新特性使用指南

## use API - 声明式异步数据获取

React 19 引入了 `use` API，可以与 `Suspense` 配合，写出更简洁的声明式异步数据获取代码。

### 基本用法

```tsx
import { use, Suspense } from 'react'

// 创建异步数据 Promise
const fetchUserData = async (id: string) => {
  const response = await fetch(`/api/user/${id}`)
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
}

function UserProfile({ userId }: { userId: string }) {
  // 直接使用 use 读取 Promise，无需 useState + useEffect
  const userPromise = fetchUserData(userId)
  const user = use(userPromise)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId="123" />
    </Suspense>
  )
}
```

### 与 React Router v7 Loader 结合

```typescript
// router/modules/user.ts
{
  path: '/user/:id',
  component: () => import('@/pages/User/index'),
  loader: async ({ params }) => {
    // 返回 Promise，而不是直接 await
    return fetchUserData(params.id)
  },
}
```

```tsx
// pages/User/index.tsx
import { useLoaderData } from 'react-router-dom'
import { use, Suspense } from 'react'

export default function User() {
  const userPromise = useLoaderData()  // 获取 loader 返回的 Promise
  const user = use(userPromise)  // 使用 use API 读取
  
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  )
}
```

### 条件读取 Context

```tsx
import { use } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext'

function Heading({ children }: { children?: string }) {
  if (!children) return null
  
  // 条件读取 Context
  const theme = use(ThemeContext)
  return <h1 style={{ color: theme.color }}>{children}</h1>
}
```

### 错误处理

```tsx
import { use, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function UserProfile({ userId }: { userId: string }) {
  const userPromise = fetchUserData(userId)
  const user = use(userPromise)  // 如果 Promise reject，会抛出错误
  
  return <div>{user.name}</div>
}

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <UserProfile userId="123" />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### 优势对比

**传统方式（React 18）**：
```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    setLoading(true)
    fetchUserData(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])
  
  if (loading) return <Loading />
  if (error) return <Error />
  return <div>{user.name}</div>
}
```

**React 19 方式**：
```tsx
function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUserData(userId))  // 简洁！
  return <div>{user.name}</div>
}
```

## 注意事项

1. **必须在 Suspense 边界内使用**：`use` 读取 Promise 时必须在 `<Suspense>` 内
2. **错误处理**：Promise reject 会抛出错误，需要用 ErrorBoundary 捕获
3. **条件使用**：可以在条件语句中使用 `use`，但需要确保 Promise 稳定

## 参考

- [React 19 use API 文档](https://zh-hans.react.dev/reference/react/use)
- [React 19 官方博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)

