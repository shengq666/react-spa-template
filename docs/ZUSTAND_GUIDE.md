# Zustand 使用指南

> 本项目使用 Zustand 作为全局状态管理方案。本文档包含核心用法、最佳实践和常见坑点。

## 快速开始

### 1. 创建 Store

```typescript
// src/store/counterStore.ts
import { create } from 'zustand'

interface CounterState {
	count: number
	increment: () => void
	decrement: () => void
}

export const useCounterStore = create<CounterState>(set => ({
	count: 0,
	increment: () => set(state => ({ count: state.count + 1 })),
	decrement: () => set(state => ({ count: state.count - 1 })),
}))
```

### 2. 在组件中使用

```tsx
import { useCounterStore } from '@/store/counterStore'

function Counter() {
	// ✅ 推荐：只订阅需要的字段
	const count = useCounterStore(state => state.count)
	const increment = useCounterStore(state => state.increment)

	// ❌ 不推荐：订阅整个 store（会导致不必要的重渲染）
	// const { count, increment } = useCounterStore()

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment}>+</button>
		</div>
	)
}
```

## 核心要点（必读）

### ⚠️ 选择器（selector）要保持稳定

**问题**：直接返回对象字面量会在每次渲染时创建新引用，导致组件频繁重渲染，甚至触发 "Maximum update depth exceeded"。

```typescript
// ❌ 错误：每次渲染都创建新对象
const { appReady, globalLoading } = useAppStore(state => ({
	appReady: state.appReady,
	globalLoading: state.globalLoading,
}))

// ✅ 正确：分别订阅字段
const appReady = useAppStore(state => state.appReady)
const globalLoading = useAppStore(state => state.globalLoading)

// ✅ 或使用 shallow（需要安装 zustand/shallow）
import { shallow } from 'zustand/shallow'
const { appReady, globalLoading } = useAppStore(
	state => ({ appReady: state.appReady, globalLoading: state.globalLoading }),
	shallow,
)
```

### ⚠️ 避免在渲染期间调用 `set`

只能在事件处理、effect、异步 action 中调用 `set`，不要在组件渲染函数中直接调用。

### ✅ 异步 action 建议写在 store 内部

统一在 store 中封装异步逻辑，方便复用和调试：

```typescript
export const useUserStore = create<UserState>((set, get) => ({
	user: null,
	loading: false,
	fetchUser: async (id: string) => {
		set({ loading: true })
		try {
			const user = await api.getUser(id)
			set({ user, loading: false })
		} catch (error) {
			set({ error: error.message, loading: false })
		}
	},
}))
```

### ✅ 与本地存储同步

使用 `src/utils/storage.ts`，不要直接 `localStorage.setItem`：

```typescript
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
}))
```

## 完整示例

### 示例 1：异步数据获取

```typescript
// src/store/userStore.ts
import { create } from 'zustand'
import type { UserInfo } from '@/types'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

export interface UserState {
	user: UserInfo | null
	loading: boolean
	fetchCurrentUser: () => Promise<void>
	clearUser: () => void
}

export const useUserStore = create<UserState>(set => ({
	user: storage.get<UserInfo>(STORAGE_KEYS.USER_INFO) ?? null,
	loading: false,
	fetchCurrentUser: async () => {
		set({ loading: true })
		try {
		// 模拟 API 调用
			const user = await fetchUserFromAPI()
			storage.set(STORAGE_ KEYS.USER_INFO, user)
			set({ user, loading: false })
		} catch (error) {
			set({ loading: false })
		}
	},
	clearUser: () => {
		storage.remove(STORAGE_KEYS.USER_INFO)
		set({ user: null })
	},
}))
```

### 示例 2：在非组件中使用

Zustand 提供了三个强大的底层 API，可以在**任何地方**使用：

```typescript
// 1. getState() - 获取非响应式的最新状态
const count = useCounterStore.getState().count
useCounterStore.getState().increment()

// 2. setState() - 直接更新状态
useCounterStore.setState({ count: 10 })
useCounterStore.setState(state => ({ count: state.count + 1 }))

// 3. subscribe() - 订阅状态变化
const unsubscribe = useCounterStore.subscribe(state => {
	console.log('状态变化:', state)
})
unsubscribe() // 取消订阅
```

## 性能优化

### 1. 选择性订阅（最重要）

```typescript
// ❌ 差：订阅整个 store，任何字段变化都会重渲染
const { todos, addTodo } = useTodoStore()

// ✅ 好：只订阅需要的字段
const todos = useTodoStore(state => state.todos)
const addTodo = useTodoStore(state => state.addTodo)
```

### 2. 列表渲染优化

对于列表场景，使用 `React.memo` 或细粒度订阅：

```tsx
// 方式 A：使用 memo
const TodoItem = React.memo(({ todo, onToggle }) => {
	return <div onClick={() => onToggle(todo.id)}>{todo.text}</div>
})

// 方式 B：细粒度订阅（性能最优）
function TodoItem({ todoId }: { todoId: string }) {
	const todo = useTodoStore(state => state.todos.find(t => t.id === todoId))
	const toggleTodo = useTodoStore(state => state.toggleTodo)
	return <div onClick={() => toggleTodo(todoId)}>{todo?.text}</div>
}
```

## 常见问题

### Q: 什么时候用 Zustand，什么时候用 useState？

- **Zustand**：需要在多个组件间共享的状态（用户信息、主题配置、购物车）
- **useState**：只属于单个组件的状态（表单输入、展开/收起）

### Q: 列表场景下，任意一个 item 变化会导致整个列表重渲染吗？

**取决于订阅方式**：

```typescript
// ❌ 会：订阅整个数组
const { todos } = useTodoStore() // 任何 todo 变化都重渲染

// ✅ 不会：使用 memo 或细粒度订阅
const todos = useTodoStore(state => state.todos)
const TodoItem = React.memo(({ todo }) => <div>{todo.text}</div>)
```

### Q: 如何在 store 中访问其他 store？

```typescript
const user = useUserStore.getState().user
```

### Q: StrictMode 下会执行两次怎么办？

React 18+ StrictMode 会让 `useEffect` 在开发环境执行两遍。确保异步 action 是幂等的，或使用防抖：

```typescript
// 在顶层手动调用一次
useEffect(() => {
	useAppStore.getState().initApp()
}, [])
```

## 最佳实践

1. **按功能模块划分**：`userStore.ts`、`appStore.ts`、`themeStore.ts`
2. **定义清晰的类型**：为每个 store 定义 `XxxState` 接口
3. **避免过度使用**：全局状态用 Zustand，组件状态用 `useState`
4. **使用 storage 工具**：统一通过 `src/utils/storage.ts` 管理本地存储

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand TypeScript 指南](https://github.com/pmndrs/zustand#typescript)
