# Zustand 状态管理使用指南

## 概述

[Zustand](https://github.com/pmndrs/zustand) 是一个轻量级、易用的 React 状态管理库。本项目使用 Zustand 作为全局状态管理方案，用于管理用户信息、主题配置等全局状态。

## 为什么选择 Zustand？

### 优势

- **轻量级**：体积小（约 1KB），无依赖
- **API 简洁**：学习成本低，上手快
- **TypeScript 友好**：完整的类型支持
- **性能优秀**：基于 React Context，支持细粒度更新
- **灵活**：支持中间件、持久化、DevTools 等扩展

### 与其他方案对比

| 特性 | Zustand | Redux | MobX | Jotai |
|------|---------|-------|------|-------|
| 学习曲线 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 代码量 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 基础用法

### 1. 创建 Store

在 `src/store/` 目录下创建 store 文件：

```typescript
// src/store/counterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### 2. 在组件中使用

```typescript
import { useCounterStore } from '@/store/counterStore'

function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### 3. 选择性订阅（性能优化）

如果只需要部分状态，可以只订阅需要的字段：

```typescript
// ✅ 只订阅 count，避免不必要的重渲染
const count = useCounterStore(state => state.count)

// ❌ 订阅整个 store，任何字段变化都会重渲染
const { count } = useCounterStore()
```

## 完整 Demo 示例

### Demo 1: 基础计数器

**Store 定义**：

```typescript
// src/store/counterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

**组件使用**：

```tsx
import { useCounterStore } from '@/store/counterStore'
import { Button } from 'antd-mobile'

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
      <Button onClick={reset}>Reset</Button>
    </div>
  )
}
```

### Demo 2: 待办事项管理

**Store 定义**：

```typescript
// src/store/todoStore.ts
import { create } from 'zustand'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  clearCompleted: () => void
}

export const useTodoStore = create<TodoState>(set => ({
  todos: [],
  addTodo: text =>
    set(state => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          text,
          completed: false,
        },
      ],
    })),
  toggleTodo: id =>
    set(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  removeTodo: id =>
    set(state => ({
      todos: state.todos.filter(todo => todo.id !== id),
    })),
  clearCompleted: () =>
    set(state => ({
      todos: state.todos.filter(todo => !todo.completed),
    })),
}))
```

**组件使用**：

```tsx
import { useState } from 'react'
import { Button, Input, List } from 'antd-mobile'
import { useTodoStore } from '@/store/todoStore'

function TodoDemo() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } =
    useTodoStore()
  const [inputValue, setInputValue] = useState('')

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div>
      <div>
        <Input
          value={inputValue}
          onChange={setInputValue}
          onEnterPress={handleAddTodo}
        />
        <Button onClick={handleAddTodo}>添加</Button>
      </div>

      <List>
        {todos.map(todo => (
          <List.Item
            key={todo.id}
            extra={
              <Button
                size="small"
                onClick={() => removeTodo(todo.id)}
              >
                删除
              </Button>
            }
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
          </List.Item>
        ))}
      </List>

      <Button onClick={clearCompleted}>清除已完成</Button>
    </div>
  )
}
```

### Demo 3: 异步数据获取

**Store 定义**：

```typescript
// src/store/asyncDataStore.ts
import { create } from 'zustand'

interface AsyncDataState {
  data: string | null
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
  reset: () => void
}

export const useAsyncDataStore = create<AsyncDataState>(set => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null })
    try {
      // 模拟 API 请求
      await new Promise(resolve => setTimeout(resolve, 1500))
      set({
        data: `数据加载成功，时间：${new Date().toLocaleTimeString()}`,
        loading: false,
      })
    }
    catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载失败',
        loading: false,
      })
    }
  },
  reset: () => set({ data: null, error: null, loading: false }),
}))
```

**组件使用**：

```tsx
import { Button, SpinLoading, Tag } from 'antd-mobile'
import { useAsyncDataStore } from '@/store/asyncDataStore'

function AsyncDataDemo() {
  const { data, loading, error, fetchData, reset } = useAsyncDataStore()

  return (
    <div>
      <Button onClick={fetchData} disabled={loading}>
        加载数据
      </Button>
      <Button onClick={reset}>重置</Button>

      {loading && (
        <div>
          <SpinLoading />
          <span>加载中...</span>
        </div>
      )}

      {error && <Tag color="danger">错误: {error}</Tag>}

      {data && <Tag color="success">{data}</Tag>}
    </div>
  )
}
```

### Demo 4: 持久化（结合 localStorage）

**Store 定义**：

```typescript
// src/store/userStore.ts
import { create } from 'zustand'
import type { UserInfo } from '@/types'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

export interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>(set => ({
  // 初始化时从 localStorage 读取
  user: storage.get<UserInfo>(STORAGE_KEYS.USER_INFO) ?? null,
  
  setUser: user => {
    if (user) {
      // 保存到 localStorage
      storage.set(STORAGE_KEYS.USER_INFO, user)
    } else {
      storage.remove(STORAGE_KEYS.USER_INFO)
    }
    set({ user })
  },
  
  clearUser: () => {
    storage.remove(STORAGE_KEYS.USER_INFO)
    set({ user: null })
  },
}))
```

**组件使用**：

```tsx
import { Button, List } from 'antd-mobile'
import { useUserStore } from '@/store/userStore'

function UserDemo() {
  const { user, setUser, clearUser } = useUserStore()

  const handleLogin = async () => {
    // 模拟登录
    const userInfo = {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
    }
    setUser(userInfo)
  }

  return (
    <div>
      {user ? (
        <div>
          <List>
            <List.Item extra={user.username}>用户名</List.Item>
            <List.Item extra={user.email}>邮箱</List.Item>
          </List>
          <Button onClick={clearUser}>退出登录</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>登录</Button>
      )}
    </div>
  )
}
```

## 进阶用法

### 1. 异步操作

```typescript
import { create } from 'zustand'

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: (id: string) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const user = await api.getUser(id)
      set({ user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
```

### 2. 在 Store 外部使用

不依赖 React 组件，直接获取或更新状态：

```typescript
import { useCounterStore } from '@/store/counterStore'

// 获取当前状态
const count = useCounterStore.getState().count

// 更新状态
useCounterStore.getState().increment()

// 订阅状态变化
const unsubscribe = useCounterStore.subscribe(state => {
  console.log('Count changed:', state.count)
})

// 取消订阅
unsubscribe()
```

### 3. 中间件

Zustand 支持中间件扩展功能，常用的有：

- `persist`：持久化
- `devtools`：Redux DevTools 支持
- `immer`：不可变状态更新

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useStore = create<State>()(
  devtools(
    set => ({
      // ... state
    }),
    { name: 'MyStore' }
  )
)
```

## 项目中的实际应用

### 1. 用户信息管理（userStore）

位置：`src/store/userStore.ts`

**完整代码**：

```typescript
import { create } from 'zustand'
import type { UserInfo } from '@/types'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

export interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>(set => ({
  user: storage.get<UserInfo>(STORAGE_KEYS.USER_INFO) ?? null,
  setUser: user => {
    if (user) {
      storage.set(STORAGE_KEYS.USER_INFO, user)
    } else {
      storage.remove(STORAGE_KEYS.USER_INFO)
    }
    set({ user })
  },
  clearUser: () => {
    storage.remove(STORAGE_KEYS.USER_INFO)
    set({ user: null })
  },
}))
```

**使用示例**：

```tsx
import { useUserStore } from '@/store/userStore'

function UserProfile() {
  const { user, setUser, clearUser } = useUserStore()

  const handleLogin = async () => {
    const userInfo = await login()
    setUser(userInfo)
  }

  const handleLogout = () => {
    clearUser()
  }

  return (
    <div>
      {user ? (
        <div>
          <p>用户名: {user.username}</p>
          <button onClick={handleLogout}>退出</button>
        </div>
      ) : (
        <button onClick={handleLogin}>登录</button>
      )}
    </div>
  )
}
```

### 2. 主题管理（themeStore）

位置：`src/theme/useTheme.ts`

**完整代码**：

```typescript
import { create } from 'zustand'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import { applyTheme } from './applyTheme'
import type { BrandId } from './tokens'

interface ThemeState {
  brandId: BrandId
  setBrand: (brandId: BrandId) => void
}

const getInitialBrand = (): BrandId => {
  const saved = storage.get<BrandId | null>(STORAGE_KEYS.THEME)
  return saved ?? 'default'
}

const initialBrandId = getInitialBrand()

const useThemeStore = create<ThemeState>(set => ({
  brandId: initialBrandId,
  setBrand: brandId => {
    storage.set(STORAGE_KEYS.THEME, brandId)
    set({ brandId })
    // 应用主题样式
    applyTheme(brandId)
  },
}))

export function useTheme() {
  return useThemeStore()
}
```

**使用示例**：

```tsx
import { useTheme } from '@/theme/useTheme'
import { BRAND_OPTIONS } from '@/theme/tokens'

function ThemeSwitcher() {
  const { brandId, setBrand } = useTheme()

  return (
    <select value={brandId} onChange={e => setBrand(e.target.value)}>
      {BRAND_OPTIONS.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  )
}
```

## 最佳实践

### 1. Store 组织方式

**推荐**：按功能模块划分，每个模块一个 store 文件

```
src/
├── store/
│   ├── userStore.ts      # 用户相关
│   ├── cartStore.ts      # 购物车相关
│   └── settingsStore.ts  # 设置相关
```

### 2. 类型定义

**推荐**：为每个 store 定义清晰的接口类型

```typescript
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>(set => ({
  // ...
}))
```

### 3. 选择性订阅

**推荐**：只订阅需要的字段，避免不必要的重渲染

```typescript
// ✅ 好：只订阅 count
const count = useCounterStore(state => state.count)

// ❌ 差：订阅整个 store
const { count } = useCounterStore()
```

### 4. 命名规范

**推荐**：
- Store 文件名：`xxxStore.ts`（如 `userStore.ts`）
- Hook 名称：`useXxxStore`（如 `useUserStore`）
- 状态接口：`XxxState`（如 `UserState`）

### 5. 避免过度使用

**原则**：
- **全局状态**：使用 Zustand（如用户信息、主题配置）
- **组件状态**：使用 `useState`（如表单输入、临时 UI 状态）
- **派生状态**：使用 `useMemo` 或 `useSelector`

## 常见问题

### Q: 什么时候使用 Zustand，什么时候使用 useState？

**A**: 
- **Zustand**：需要在多个组件间共享的状态，如用户信息、购物车、主题配置
- **useState**：只属于单个组件的状态，如表单输入、展开/收起状态

### Q: Zustand 会导致性能问题吗？

**A**: 不会。Zustand 支持选择性订阅，只有订阅的字段变化才会触发重渲染：

```typescript
// 只订阅 count，increment 变化不会触发重渲染
const count = useCounterStore(state => state.count)
```

### Q: 如何在 store 中访问其他 store？

**A**: 可以在 store 外部获取其他 store 的状态：

```typescript
// 在 store 外部获取其他 store
const user = useUserStore.getState().user
```

### Q: 如何重置 store 到初始状态？

**A**: 可以创建一个 `reset` 方法：

```typescript
export const useCounterStore = create<CounterState>((set, get) => {
  const initialState = { count: 0 }
  
  return {
    ...initialState,
    increment: () => set(state => ({ count: state.count + 1 })),
    reset: () => set(initialState),
  }
})
```

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand TypeScript 指南](https://github.com/pmndrs/zustand#typescript)
- [Zustand 中间件文档](https://github.com/pmndrs/zustand#middleware)

