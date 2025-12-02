# React 版本说明

## 当前版本

项目使用 **React 19.0.0**，以充分利用 React 19 的新特性。

## React 19 新特性

### 1. `use` API - 声明式异步数据获取

React 19 引入了 `use` API，可以与 `Suspense` 配合，写出更简洁的声明式异步数据获取代码：

```tsx
import { use, Suspense } from 'react'

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)
  return comments.map(comment => <p key={comment.id}>{comment}</p>)
}

function Page({ commentsPromise }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

### 2. 改进的 Suspense

- 更好的并发渲染支持
- 更流畅的加载体验
- 支持服务端组件

### 3. 其他改进

- 更好的服务器组件支持
- 改进的并发特性
- 性能优化

## antd-mobile 兼容性

### 问题

antd-mobile v5 官方支持 React 16-18，使用 React 19 会出现：
- 警告：`antd-mobile v5 support React is 16 ~ 18`
- 错误：`unmountComponentAtNode is not a function`

### 解决方案

使用 antd-mobile 提供的 `unstableSetRender` API 进行兼容性配置：

```typescript
// src/utils/react19-compat.ts
import { unstableSetRender } from 'antd-mobile'
import { createRoot } from 'react-dom/client'

export function setupReact19Compat() {
  unstableSetRender((node, container) => {
    const root = createRoot(container)
    root.render(node)
    return () => root.unmount()
  })
}
```

在 `main.tsx` 中调用（必须在其他 antd-mobile 使用之前）：

```typescript
import { setupReact19Compat } from '@/utils/react19-compat'

setupReact19Compat()
```

### 工作原理

`unstableSetRender` 允许自定义 antd-mobile 内部使用的渲染方法，将旧的 `ReactDOM.render` 替换为 React 19 的 `createRoot` API，从而解决兼容性问题。

## 使用建议

### 1. 利用 `use` API 进行数据获取

```tsx
import { use } from 'react'
import { Suspense } from 'react'

// 创建数据 Promise
const fetchUserData = async (id: string) => {
  const response = await fetch(`/api/user/${id}`)
  return response.json()
}

function UserProfile({ userId }: { userId: string }) {
  const userPromise = fetchUserData(userId)
  const user = use(userPromise)  // 直接使用，无需 useState + useEffect
  
  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId="123" />
    </Suspense>
  )
}
```

### 2. 与 React Router v7 的 Loader 结合

```typescript
// router/modules/user.ts
{
  path: '/user/:id',
  component: () => import('@/pages/User/index'),
  loader: async ({ params }) => {
    return fetchUserData(params.id)
  },
}
```

```tsx
// pages/User/index.tsx
import { useLoaderData, use } from 'react-router-dom'
import { Suspense } from 'react'

export default function User() {
  const userPromise = useLoaderData()  // 获取 loader 返回的 Promise
  const user = use(userPromise)  // 使用 use API 读取
  
  return <div>{user.name}</div>
}
```

## 注意事项

1. **兼容性配置必须在应用启动时调用**：`setupReact19Compat()` 必须在任何 antd-mobile 组件使用之前执行
2. **API 稳定性**：`unstableSetRender` 是 unstable API，未来 antd-mobile 可能会提供更稳定的方案
3. **关注更新**：建议关注 antd-mobile 的更新，等待官方正式支持 React 19

## 参考链接

- [React 19 官方博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)
- [antd-mobile GitHub](https://github.com/ant-design/ant-design-mobile)
- [React 19 use API 文档](https://zh-hans.react.dev/reference/react/use)
