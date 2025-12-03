# Zustand 状态管理使用指南

## 概述

[Zustand](https://github.com/pmndrs/zustand) 是一个轻量级、易用的 React 状态管理库。本项目使用 Zustand 作为全局状态管理方案，用于管理用户信息、主题配置等全局状态。

## 为什么选择 Zustand？

### 优势

- **轻量级**：体积小（约 1KB），无依赖
- **API 简洁**：学习成本低，上手快
- **TypeScript 友好**：完整的类型支持
- **性能优秀**：支持细粒度订阅，只有变化的部分重渲染
- **灵活**：支持中间件、持久化、DevTools 等扩展

### 与其他方案对比

| 特性       | Zustand    | Redux    | MobX       | Jotai      |
| ---------- | ---------- | -------- | ---------- | ---------- |
| 学习曲线   | ⭐⭐⭐⭐⭐ | ⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| 代码量     | ⭐⭐⭐⭐⭐ | ⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 性能       | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |

### 为什么 Zustand 的 API 像 class 组件的 setState？

很多开发者会发现，Zustand 的 `set` 写法很像 React class 组件的 `this.setState`：

```typescript
// Zustand
increment: () => set(state => ({ count: state.count + 1 }))

// React Class Component (旧写法)
this.setState(state => ({ count: state.count + 1 }))
```

**这是有意的设计，原因如下：**

1. **熟悉度**：`setState` 是 React 开发者最熟悉的状态更新模式之一，降低学习成本
2. **函数式更新**：支持基于当前状态计算新状态，避免闭包陷阱
3. **状态合并**：自动合并状态对象，不需要手动解构
4. **时间旅行调试**：与 Redux DevTools 兼容，方便调试

**但本质上不同：**

- **Class 组件**：`this.setState` 更新组件内部状态，只影响当前组件
- **Zustand**：`set` 更新全局 store，可以跨组件共享

**为什么不用 hooks 的 `setState` 写法？**

Hooks 的 `setState` 写法虽然更现代，但有几个限制：

```typescript
// Hooks 写法
const [count, setCount] = useState(0)
setCount(prev => prev + 1)

// 问题：
// 1. 只能在一个组件内使用
// 2. 无法跨组件共享
// 3. 无法在非 React 组件中使用
```

Zustand 的设计哲学是：**保留 `setState` 的简洁性，但让状态可以全局共享**。

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

### 3. 选择性订阅

只订阅需要的字段，避免不必要的重渲染：

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
			todos: state.todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
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
	const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoStore()
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
				<Input value={inputValue} onChange={setInputValue} onEnterPress={handleAddTodo} />
				<Button onClick={handleAddTodo}>添加</Button>
			</div>

			<List>
				{todos.map(todo => (
					<List.Item
						key={todo.id}
						extra={
							<Button size="small" onClick={() => removeTodo(todo.id)}>
								删除
							</Button>
						}
					>
						<input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
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
		} catch (error) {
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

### 2. 在 Store 外部使用（非 Hook API）

Zustand 提供了三个强大的底层 API，可以在**任何地方**（包括非 React 组件）使用：

#### `getState()` - 获取非响应式的最新状态

```typescript
import { useCounterStore } from '@/store/counterStore'

// 获取当前状态的快照（非响应式，不会触发组件更新）
const count = useCounterStore.getState().count

// 调用 store 中的方法
useCounterStore.getState().increment()
```

**使用场景**：

- 在事件处理函数中一次性读取状态
- 在工具函数、API 拦截器等非组件代码中访问状态
- 不需要响应式更新的场景

#### `setState()` - 直接更新状态

```typescript
// 方式 1：传入对象（会合并到当前状态）
useCounterStore.setState({ count: 10 })

// 方式 2：传入函数（基于当前状态计算）
useCounterStore.setState(state => ({ count: state.count + 1 }))

// 方式 3：部分更新（Zustand 会自动合并）
useCounterStore.setState({ count: 5 }) // 只更新 count，其他字段不变
```

**使用场景**：

- 在非组件代码中快速更新状态
- 不需要定义专门 action 的简单更新
- 与外部库集成时

**示例**：

```typescript
// src/store/dogStore.ts
const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))

// 在任何地方直接更新
useDogStore.setState({ paw: false })

// 在工具函数中
function resetDog() {
	useDogStore.setState({ paw: true, snout: true, fur: true })
}

// 在 API 拦截器中
axios.interceptors.response.use(response => {
	if (response.status === 401) {
		// 清除用户状态
		useDogStore.setState({ paw: false })
	}
	return response
})
```

#### `subscribe()` - 订阅状态变化

```typescript
// 订阅所有状态变化（同步触发）
const unsubscribe = useCounterStore.subscribe(state => {
	console.log('状态变化了:', state)
})

// 只订阅特定字段的变化
const unsubscribe = useCounterStore.subscribe(
	state => state.count, // selector
	count => {
		console.log('count 变化了:', count)
	}
)

// 取消订阅
unsubscribe()
```

**使用场景**：

- 在非组件代码中监听状态变化
- 实现日志、分析等副作用
- 与第三方库集成

**完整示例**：

```typescript
const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))

// 1. 获取非响应式的当前状态
const paw = useDogStore.getState().paw // true

// 2. 监听所有变化，每次状态更新都会同步触发
const unsub1 = useDogStore.subscribe(console.log)

// 3. 直接更新状态（会触发上面的监听器）
useDogStore.setState({ paw: false }) // 输出: { paw: false, snout: true, fur: true }

// 4. 取消订阅
unsub1()

// 5. 在组件中使用（Hook 方式，响应式）
function Component() {
	const paw = useDogStore(state => state.paw) // 响应式，会触发组件重渲染
	return <div>{paw ? '有爪子' : '无爪子'}</div>
}
```

#### 三种使用方式对比

| 方式            | 是否响应式 | 使用场景             | 示例                                      |
| --------------- | ---------- | -------------------- | ----------------------------------------- |
| **Hook**        | ✅ 是      | React 组件中         | `const count = useStore(s => s.count)`    |
| **getState()**  | ❌ 否      | 一次性读取、调用方法 | `const count = useStore.getState().count` |
| **setState()**  | ✅ 是      | 非组件代码中直接更新 | `useStore.setState({ count: 1 })`         |
| **subscribe()** | ✅ 是      | 非组件代码中监听变化 | `useStore.subscribe(console.log)`         |

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

参考 **Demo 4: 持久化** 的完整实现。项目中用于管理用户登录状态，支持自动从 localStorage 读取和保存。

### 2. 主题管理（themeStore）

位置：`src/theme/useTheme.ts`

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

## 性能优化

### 1. 选择性订阅（最重要）

**问题**：如果订阅整个 store，任何字段变化都会导致组件重渲染。

```typescript
// ❌ 差：订阅整个 store
function TodoList() {
	const { todos, addTodo, toggleTodo } = useTodoStore()
	// 只要 todos 数组中任何一个 todo 的字段变化，整个组件都会重渲染
	return todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
}
```

**解决方案**：只订阅需要的字段。

```typescript
// ✅ 好：只订阅 todos 数组
function TodoList() {
	const todos = useTodoStore(state => state.todos)
	return todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
}

// ✅ 更好：单个 todo item 只订阅自己的数据
function TodoItem({ todoId }: { todoId: string }) {
	// 只订阅特定 todo，只有这个 todo 变化才重渲染
	const todo = useTodoStore(state => state.todos.find(t => t.id === todoId))
	if (!todo) return null
	return <div>{todo.text}</div>
}
```

### 2. 列表渲染优化

对于待办事项这种列表场景，有两种优化策略：

**策略 A：组件级别订阅（适合简单场景）**

```tsx
// 父组件订阅整个列表
function TodoList() {
	const todos = useTodoStore(state => state.todos)
	const toggleTodo = useTodoStore(state => state.toggleTodo)

	return (
		<List>
			{todos.map(todo => (
				<TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
			))}
		</List>
	)
}

// 子组件使用 memo 避免不必要的重渲染
const TodoItem = React.memo(({ todo, onToggle }) => {
	return <List.Item onClick={() => onToggle(todo.id)}>{todo.text}</List.Item>
})
```

**策略 B：细粒度订阅（适合大型列表）**

```tsx
// 每个 item 独立订阅，只有自己的数据变化才重渲染
function TodoItem({ todoId }: { todoId: string }) {
	const todo = useTodoStore(
		state => state.todos.find(t => t.id === todoId),
		(a, b) => a?.completed === b?.completed && a?.text === b?.text // 自定义相等性比较
	)
	const toggleTodo = useTodoStore(state => state.toggleTodo)

	if (!todo) return null
	return <List.Item onClick={() => toggleTodo(todoId)}>{todo.text}</List.Item>
}
```

### 3. 自定义相等性比较

Zustand 默认使用 `Object.is` 比较，对于对象数组，可以自定义比较函数：

```typescript
// 只有当 count 变化时才重渲染
const count = useCounterStore(
	state => state.count,
	(a, b) => a === b // 默认行为，可以省略
)

// 对于对象，使用浅比较
const user = useUserStore(
	state => state.user,
	(a, b) => a?.id === b?.id && a?.username === b?.username
)
```

### 4. 分离 actions

Actions（函数）不会变化，不需要订阅：

```typescript
// ❌ 差：actions 也会触发订阅检查
const { todos, addTodo, toggleTodo } = useTodoStore()

// ✅ 好：只订阅数据，actions 单独获取（不会触发重渲染）
const todos = useTodoStore(state => state.todos)
const addTodo = useTodoStore(state => state.addTodo) // 或直接使用 useTodoStore.getState().addTodo
```

## Zustand vs Context + Hooks

### 核心区别对比

| 特性               | Zustand                                     | Context + Hooks                                |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| **性能**           | ⭐⭐⭐⭐⭐ 细粒度订阅，只有变化的部分重渲染 | ⭐⭐⭐ 整个 Context 变化会导致所有消费者重渲染 |
| **代码量**         | ⭐⭐⭐⭐⭐ 简洁，不需要 Provider 包装       | ⭐⭐⭐ 需要 Provider 包装，代码更多            |
| **学习成本**       | ⭐⭐⭐⭐⭐ API 简单直观                     | ⭐⭐⭐⭐ 需要理解 Context、useReducer 等概念   |
| **跨组件使用**     | ⭐⭐⭐⭐⭐ 任何地方都能用                   | ⭐⭐⭐ 必须在 Provider 子树内                  |
| **在非组件中使用** | ⭐⭐⭐⭐⭐ 可以直接调用 `getState()`        | ❌ 无法在非组件中使用                          |
| **DevTools**       | ⭐⭐⭐⭐⭐ 支持 Redux DevTools              | ⭐⭐⭐ 需要手动集成                            |

### 代码对比示例

#### Context + Hooks 实现

```typescript
// 1. 创建 Context
const CounterContext = createContext<{
	count: number
	increment: () => void
}>({ count: 0, increment: () => {} })

// 2. 创建 Provider
function CounterProvider({ children }) {
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)

	return (
		<CounterContext.Provider value={{ count, increment }}>
			{children}
		</CounterContext.Provider>
	)
}

// 3. 创建 Hook
function useCounter() {
	const context = useContext(CounterContext)
	if (!context) throw new Error('必须在 CounterProvider 内使用')
	return context
}

// 4. 使用
function App() {
	return (
		<CounterProvider>
			{/* 必须包装 */}
			<Counter />
		</CounterProvider>
	)
}

function Counter() {
	const { count, increment } = useCounter() // 必须在 Provider 内
	return <button onClick={increment}>{count}</button>
}
```

#### Zustand 实现

```typescript
// 1. 创建 Store（一步到位）
const useCounterStore = create<CounterState>(set => ({
	count: 0,
	increment: () => set(state => ({ count: state.count + 1 })),
}))

// 2. 使用（无需 Provider）
function Counter() {
	const { count, increment } = useCounterStore() // 任何地方都能用
	return <button onClick={increment}>{count}</button>
}

// 3. 甚至在非组件中使用
const count = useCounterStore.getState().count
useCounterStore.getState().increment()
```

### 性能对比

**Context + Hooks 的问题**：

```typescript
// ❌ Context 问题：任何值变化，所有消费者都重渲染
const AppContext = createContext({ user: null, theme: 'light', count: 0 })

function AppProvider({ children }) {
	const [user, setUser] = useState(null)
	const [theme, setTheme] = useState('light')
	const [count, setCount] = useState(0)

	// 只要 count 变化，所有订阅 Context 的组件都重渲染
	return (
		<AppContext.Provider value={{ user, theme, count }}>
			{children}
		</AppContext.Provider>
	)
}

// 即使只用到 user，count 变化也会重渲染这个组件
function UserProfile() {
	const { user } = useContext(AppContext) // count 变化也会重渲染！
	return <div>{user?.username}</div>
}
```

**Zustand 的优势**：

```typescript
// ✅ Zustand：只订阅需要的字段
function UserProfile() {
	const user = useUserStore(state => state.user) // 只有 user 变化才重渲染
	return <div>{user?.username}</div>
}

function Counter() {
	const count = useCounterStore(state => state.count) // 只有 count 变化才重渲染
	return <div>{count}</div>
}
// 两者互不影响！
```

### 什么时候用 Context，什么时候用 Zustand？

**使用 Context + Hooks 的场景**：

- ✅ 简单的主题切换（很少变化）
- ✅ 静态配置（如 locale、权限配置）
- ✅ 需要 Provider 层做副作用（如数据初始化）
- ✅ 组件树很小，性能不是问题

**使用 Zustand 的场景**：

- ✅ 频繁变化的状态（如用户信息、购物车）
- ✅ 大型应用，需要细粒度性能优化
- ✅ 需要在非组件中使用状态
- ✅ 需要 DevTools 调试
- ✅ 多个独立的全局状态（不需要 Provider 包装）

### 总结

**Context + Hooks** 适合：

- 简单的、静态的配置类状态
- 组件树较小、性能要求不高的场景

**Zustand** 适合：

- 频繁变化的业务状态
- 需要性能优化的大型应用
- 需要在组件外使用状态

**本项目选择 Zustand 的原因**：

- 用户信息、主题配置都是可能频繁变化的全局状态
- 需要细粒度控制重渲染性能
- API 更简洁，代码量更少

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

### 3. 命名规范

**推荐**：

- Store 文件名：`xxxStore.ts`（如 `userStore.ts`）
- Hook 名称：`useXxxStore`（如 `useUserStore`）
- 状态接口：`XxxState`（如 `UserState`）

### 4. 避免过度使用

**原则**：

- **全局状态**：使用 Zustand（如用户信息、主题配置）
- **组件状态**：使用 `useState`（如表单输入、临时 UI 状态）
- **派生状态**：使用 `useMemo` 或 `useSelector`

## 常见问题

### Q: 什么时候使用 Zustand，什么时候使用 useState？

**A**:

- **Zustand**：需要在多个组件间共享的状态，如用户信息、购物车、主题配置
- **useState**：只属于单个组件的状态，如表单输入、展开/收起状态

### Q: Zustand 会导致性能问题吗？待办事项中，如果任意一个 todo 的字段变化，会导致整个组件重新渲染吗？

**A**: **这取决于你的订阅方式**。

**情况 1：订阅整个 store（会导致全量重渲染）**

```typescript
// ❌ 差：订阅整个 store
function TodoList() {
	const { todos, addTodo, toggleTodo } = useTodoStore()
	// 问题：只要 todos 数组中任何一个 todo 的 id/text/completed 变化
	//      整个 TodoList 组件都会重新渲染，所有 TodoItem 也会重新渲染
	return todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
}
```

**解决方案 A：使用 React.memo 优化子组件**

```typescript
// ✅ 好：父组件订阅，子组件用 memo 优化
function TodoList() {
	const todos = useTodoStore(state => state.todos)
	const toggleTodo = useTodoStore(state => state.toggleTodo)

	return todos.map(todo => (
		<TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
	))
}

// 子组件只有 props 变化才重渲染
const TodoItem = React.memo(({ todo, onToggle }) => {
	return <div onClick={() => onToggle(todo.id)}>{todo.text}</div>
})
```

**解决方案 B：细粒度订阅（最佳性能）**

```typescript
// ✅ 最好：每个 item 独立订阅，只有自己的数据变化才重渲染
function TodoItem({ todoId }: { todoId: string }) {
	const todo = useTodoStore(state => state.todos.find(t => t.id === todoId))
	const toggleTodo = useTodoStore(state => state.toggleTodo)

	if (!todo) return null
	// 只有这个 todo 的数据变化才重渲染，其他 todo 变化不影响
	return <div onClick={() => toggleTodo(todoId)}>{todo.text}</div>
}
```

**总结**：

- ❌ 订阅整个 store + 不用 memo：任何字段变化都重渲染
- ✅ 订阅整个 store + 用 memo：只有相关 item 重渲染
- ✅✅ 细粒度订阅：性能最优，只有变化的部分重渲染

**重要**：对于列表场景（如待办事项），如果订阅整个数组，任何一个 item 变化都会导致整个列表重渲染。建议：

1. 使用 `React.memo` 优化子组件
2. 或每个 item 独立订阅（细粒度订阅）

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
