# React Hooks 使用指南（Vue 开发者版）

> 本文档面向 Vue 开发者，帮助快速理解 React Hooks 与 Vue Composition API 的对应关系和区别。

## 核心概念对比

| React Hooks   | Vue Composition API                   | 说明              |
| ------------- | ------------------------------------- | ----------------- |
| `useState`    | `ref` / `reactive`                    | 响应式状态        |
| `useEffect`   | `watch` / `watchEffect` / `onMounted` | 副作用处理        |
| `useMemo`     | `computed`                            | 计算属性          |
| `useCallback` | 函数缓存（Vue 自动优化）              | 函数缓存          |
| `useContext`  | `provide` / `inject`                  | 跨组件数据传递    |
| `useRef`      | `ref`（DOM 引用）                     | DOM 引用 / 可变值 |
| `useReducer`  | `reactive` + 自定义函数               | 复杂状态管理      |

## 1. useState - 响应式状态

### Vue 写法

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => {
	count.value++
}
</script>

<template>
	<div>{{ count }}</div>
	<button @click="increment">+</button>
</template>
```

### React 写法

```tsx
import { useState } from 'react'

function Counter() {
	const [count, setCount] = useState(0)
	const increment = () => {
		setCount(count + 1)
		// 或使用函数式更新
		// setCount(prev => prev + 1)
	}

	return (
		<div>
			<div>{count}</div>
			<button onClick={increment}>+</button>
		</div>
	)
}
```

### 关键区别

| 特性           | Vue             | React                      |
| -------------- | --------------- | -------------------------- |
| **访问方式**   | `count.value`   | `count`（直接访问）        |
| **更新方式**   | `count.value++` | `setCount(count + 1)`      |
| **响应式原理** | Proxy           | 闭包 + 重渲染              |
| **类型推断**   | 自动推断        | 需要显式类型（TypeScript） |

**重要**：React 的 `setState` 行为是**批量更新**的，但在不同场景下表现不同：

### setState 的同步/异步行为

**React 18+ 的行为**：

1. **事件处理函数中（批量更新，看起来像异步）**：

```tsx
function Counter() {
	const [count, setCount] = useState(0)

	const handleClick = () => {
		setCount(count + 1)
		setCount(count + 1)
		setCount(count + 1)
		// 结果：count 只增加 1（批量更新）
		// 因为三个 setCount 都基于同一个 count 值（闭包中的旧值）
	}
}
```

2. **异步回调中（React 18+ 仍然是批量更新）**：

```tsx
function Counter() {
	const [count, setCount] = useState(0)

	const handleClick = () => {
		setTimeout(() => {
			setCount(count + 1)
			setCount(count + 1)
			// React 18+：仍然是批量更新，只增加 1
		}, 1000)
	}
}
```

3. **使用 `flushSync` 强制同步更新**：

```tsx
import { flushSync } from 'react-dom'

function Counter() {
	const [count, setCount] = useState(0)

	const handleClick = () => {
		flushSync(() => {
			setCount(count + 1) // 立即更新
		})
		console.log(count) // 可以立即看到新值
	}
}
```

**最佳实践**：总是使用函数式更新，避免闭包陷阱：

```tsx
// ✅ 正确：函数式更新，总是基于最新值
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
// 结果：count 增加 3

// ⚠️ 可能有问题：直接使用当前值（闭包陷阱）
setCount(count + 1) // 如果 count 在闭包中是旧值
```

## 2. useEffect - 副作用处理

### Vue 写法

```vue
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const userId = ref(1)

// 监听变化
watch(userId, newId => {
	fetchUser(newId)
})

// 组件挂载时
onMounted(() => {
	console.log('组件已挂载')
})

// 组件卸载时
onUnmounted(() => {
	console.log('组件已卸载')
})
</script>
```

### React 写法

```tsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
	const [user, setUser] = useState(null)

	// 等价于 Vue 的 watch + onMounted
	useEffect(() => {
		// 组件挂载或 userId 变化时执行
		fetchUser(userId).then(setUser)

		// 清理函数（等价于 onUnmounted）
		return () => {
			console.log('清理副作用')
		}
	}, [userId]) // 依赖数组：只有 userId 变化时才重新执行

	// 只在组件挂载时执行一次（等价于 onMounted）
	useEffect(() => {
		console.log('组件已挂载')
	}, []) // 空依赖数组

	// 每次渲染都执行（不推荐，类似 watchEffect）
	useEffect(() => {
		console.log('每次渲染都执行')
	}) // 没有依赖数组
}
```

### 关键区别

| 特性         | Vue                                   | React                     |
| ------------ | ------------------------------------- | ------------------------- |
| **生命周期** | `onMounted`、`onUnmounted` 等独立函数 | `useEffect` 统一处理      |
| **依赖追踪** | 自动追踪响应式依赖                    | 手动指定依赖数组 `[deps]` |
| **清理函数** | `onUnmounted`                         | `useEffect` 的返回函数    |
| **执行时机** | 在 DOM 更新后同步执行                 | 在 DOM 更新后异步执行     |

**重要规则**：

1. **依赖数组必须完整**：如果 effect 中使用了某个变量，必须添加到依赖数组
2. **空数组 `[]`**：只在组件挂载时执行一次（类似 `onMounted`）
3. **无依赖数组**：每次渲染都执行（不推荐，性能差）

```tsx
// ❌ 错误：缺少依赖
useEffect(() => {
	fetchUser(userId) // 使用了 userId，但没在依赖数组中
}, []) // 缺少 userId

// ✅ 正确：包含所有依赖
useEffect(() => {
	fetchUser(userId)
}, [userId])
```

## 3. useMemo - 计算属性

### Vue 写法

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)
</script>
```

### React 写法

```tsx
import { useState, useMemo } from 'react'

function Counter() {
	const [count, setCount] = useState(0)
	const doubleCount = useMemo(() => {
		return count * 2
	}, [count]) // 只有 count 变化时才重新计算

	return <div>{doubleCount}</div>
}
```

### 关键区别

| 特性             | Vue `computed` | React `useMemo`           |
| ---------------- | -------------- | ------------------------- |
| **自动依赖追踪** | ✅ 自动        | ❌ 手动指定依赖数组       |
| **语法**         | 更简洁         | 需要依赖数组              |
| **使用场景**     | 计算属性       | 昂贵的计算、对象/数组缓存 |

**使用建议**：

```tsx
// ✅ 适合：昂贵的计算
const expensiveValue = useMemo(() => {
	return heavyCalculation(data)
}, [data])

// ✅ 适合：对象/数组缓存（避免子组件不必要的重渲染）
const config = useMemo(
	() => ({
		theme: 'dark',
		locale: 'zh-CN',
	}),
	[],
)

// ⚠️ 不需要：简单计算（React 优化足够好）
const double = useMemo(() => count * 2, [count]) // 过度优化
const double = count * 2 // 这样就行
```

## 4. useCallback - 函数缓存

### Vue 写法

```vue
<script setup>
// Vue 3 自动优化，通常不需要手动缓存
const handleClick = () => {
	console.log('clicked')
}
</script>
```

### React 写法

```tsx
import { useState, useCallback } from 'react'

function TodoList() {
	const [todos, setTodos] = useState([])

	// 缓存函数，避免子组件不必要的重渲染
	const handleAdd = useCallback((text: string) => {
		setTodos(prev => [...prev, { id: Date.now(), text }])
	}, []) // 空数组：函数永远不会变化

	// 如果函数依赖了状态，需要添加到依赖数组
	const handleFilter = useCallback(
		(keyword: string) => {
			return todos.filter(todo => todo.text.includes(keyword))
		},
		[todos],
	) // 依赖 todos
}
```

### 关键区别

| 特性         | Vue                    | React                             |
| ------------ | ---------------------- | --------------------------------- |
| **是否需要** | 通常不需要（自动优化） | 需要手动缓存（配合 `React.memo`） |
| **使用场景** | 很少使用               | 传递给子组件的回调函数            |

**使用建议**：

```tsx
// ✅ 适合：传递给 memo 子组件的回调
const TodoItem = React.memo(({ todo, onToggle }) => {
	return <div onClick={() => onToggle(todo.id)}>{todo.text}</div>
})

function TodoList() {
	const handleToggle = useCallback((id: string) => {
		// ...
	}, [])
	return <TodoItem todo={todo} onToggle={handleToggle} />
}

// ⚠️ 不需要：只在当前组件使用的函数
const handleClick = useCallback(() => {
	console.log('clicked')
}, []) // 过度优化，直接定义函数即可
```

## 5. useContext - 跨组件数据传递

### Vue 写法

```vue
<!-- 父组件 -->
<script setup>
import { provide } from 'vue'

provide('theme', 'dark')
</script>

<!-- 子组件 -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme', 'light') // 第二个参数是默认值
</script>
```

### React 写法

```tsx
// 1. 创建 Context
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

// 2. 提供值（父组件）
function App() {
	return (
		<ThemeContext.Provider value="dark">
			<Child />
		</ThemeContext.Provider>
	)
}

// 3. 使用值（子组件）
function Child() {
	const theme = useContext(ThemeContext)
	return <div>当前主题: {theme}</div>
}
```

### 关键区别

| 特性         | Vue `provide/inject`          | React `useContext`                      |
| ------------ | ----------------------------- | --------------------------------------- |
| **类型安全** | 需要类型定义                  | TypeScript 原生支持                     |
| **默认值**   | `inject('key', defaultValue)` | `createContext(defaultValue)`           |
| **性能**     | 细粒度更新                    | 整个 Context 变化会导致所有消费者重渲染 |

**性能注意**：React Context 会导致所有消费者重渲染，建议：

```tsx
// ❌ 问题：任何值变化，所有消费者都重渲染
const AppContext = createContext({ user: null, theme: 'light' })

// ✅ 解决：拆分 Context
const UserContext = createContext(null)
const ThemeContext = createContext('light')
```

## 6. useRef - DOM 引用和可变值

### Vue 写法

```vue
<script setup>
import { ref } from 'vue'

// DOM 引用
const inputRef = (ref < HTMLInputElement) | (null > null)

const focusInput = () => {
	inputRef.value?.focus()
}
</script>

<template>
	<input ref="inputRef" />
	<button @click="focusInput">聚焦</button>
</template>
```

### React 写法

```tsx
import { useRef } from 'react'

function Input() {
	// DOM 引用
	const inputRef = useRef<HTMLInputElement>(null)

	const focusInput = () => {
		inputRef.current?.focus()
	}

	return (
		<>
			<input ref={inputRef} />
			<button onClick={focusInput}>聚焦</button>
		</>
	)
}
```

### 关键区别

| 特性         | Vue `ref`   | React `useRef`                |
| ------------ | ----------- | ----------------------------- |
| **访问方式** | `ref.value` | `ref.current`                 |
| **响应式**   | ✅ 响应式   | ❌ 非响应式（不会触发重渲染） |
| **用途**     | DOM 引用    | DOM 引用 + 可变值存储         |

**特殊用法**：React 的 `useRef` 还可以存储可变值（不会触发重渲染）：

```tsx
function Timer() {
	const [count, setCount] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const start = () => {
		intervalRef.current = setInterval(() => {
			setCount(prev => prev + 1)
		}, 1000)
	}

	const stop = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
		}
	}

	return <div>{count}</div>
}
```

## 7. useReducer - 复杂状态管理

### Vue 写法

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({
	count: 0,
	step: 1,
})

const increment = () => {
	state.count += state.step
}

const reset = () => {
	state.count = 0
}
</script>
```

### React 写法

```tsx
import { useReducer } from 'react'

type State = { count: number; step: number }
type Action = { type: 'increment' } | { type: 'reset' }

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'increment':
			return { ...state, count: state.count + state.step }
		case 'reset':
			return { ...state, count: 0 }
		default:
			return state
	}
}

function Counter() {
	const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })

	return (
		<div>
			<div>{state.count}</div>
			<button onClick={() => dispatch({ type: 'increment' })}>+</button>
			<button onClick={() => dispatch({ type: 'reset' })}>重置</button>
		</div>
	)
}
```

### 关键区别

| 特性         | Vue `reactive` | React `useReducer`          |
| ------------ | -------------- | --------------------------- |
| **更新方式** | 直接修改属性   | 通过 `dispatch` 派发 action |
| **状态管理** | 响应式对象     | 不可变状态更新              |
| **适用场景** | 简单状态       | 复杂状态逻辑（类似 Redux）  |

## 8. 自定义 Hooks

### Vue 写法

```vue
<script setup>
// composable 函数
function useCounter(initialValue = 0) {
	const count = ref(initialValue)
	const increment = () => count.value++
	const decrement = () => count.value--
	return { count, increment, decrement }
}

// 使用
const { count, increment } = useCounter(10)
</script>
```

### React 写法

```tsx
// 自定义 Hook（必须以 use 开头）
function useCounter(initialValue = 0) {
	const [count, setCount] = useState(initialValue)
	const increment = () => setCount(prev => prev + 1)
	const decrement = () => setCount(prev => prev - 1)
	return { count, increment, decrement }
}

// 使用
function Counter() {
	const { count, increment } = useCounter(10)
	return <div>{count}</div>
}
```

### 关键区别

| 特性       | Vue Composable | React Custom Hook      |
| ---------- | -------------- | ---------------------- |
| **命名**   | 任意名称       | 必须以 `use` 开头      |
| **返回值** | 响应式对象     | 任意值（通常返回对象） |
| **响应式** | 自动响应式     | 需要手动管理状态       |

## 常见陷阱和最佳实践

### 1. 依赖数组陷阱

```tsx
// ❌ 错误：缺少依赖
function Component({ userId }) {
	const [user, setUser] = useState(null)

	useEffect(() => {
		fetchUser(userId).then(setUser)
	}, []) // 缺少 userId，永远不会重新获取

	// ✅ 正确
	useEffect(() => {
		fetchUser(userId).then(setUser)
	}, [userId])
}
```

### 2. 闭包陷阱

```tsx
// ❌ 问题：闭包中的 count 是旧值
function Counter() {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCount(count + 1) // count 始终是初始值 0
		}, 1000)
		return () => clearInterval(timer)
	}, []) // 空数组，effect 只执行一次

	// ✅ 解决：使用函数式更新
	useEffect(() => {
		const timer = setInterval(() => {
			setCount(prev => prev + 1) // 总是基于最新值
		}, 1000)
		return () => clearInterval(timer)
	}, [])
}
```

### 3. 条件调用陷阱

```tsx
// ❌ 错误：Hooks 不能在条件语句中调用
function Component({ condition }) {
	if (condition) {
		const [count, setCount] = useState(0) // 违反规则
	}

	// ✅ 正确：Hooks 必须在顶层调用
	const [count, setCount] = useState(0)
	if (condition) {
		// 可以使用条件逻辑
	}
}
```

### 4. 性能优化建议

```tsx
// ✅ 使用 useMemo 缓存昂贵计算
const expensiveValue = useMemo(() => {
	return heavyCalculation(data)
}, [data])

// ✅ 使用 useCallback 缓存回调（配合 React.memo）
const handleClick = useCallback(() => {
	// ...
}, [deps])

// ✅ 拆分 Context，避免不必要的重渲染
const UserContext = createContext(null)
const ThemeContext = createContext('light')
```

## 快速对照表

| 场景           | Vue                                              | React                                              |
| -------------- | ------------------------------------------------ | -------------------------------------------------- |
| **响应式状态** | `const count = ref(0)`                           | `const [count, setCount] = useState(0)`            |
| **计算属性**   | `const double = computed(() => count.value * 2)` | `const double = useMemo(() => count * 2, [count])` |
| **监听变化**   | `watch(count, (newVal) => {...})`                | `useEffect(() => {...}, [count])`                  |
| **组件挂载**   | `onMounted(() => {...})`                         | `useEffect(() => {...}, [])`                       |
| **组件卸载**   | `onUnmounted(() => {...})`                       | `useEffect(() => { return () => {...} }, [])`      |
| **DOM 引用**   | `const inputRef = ref<HTMLInputElement>()`       | `const inputRef = useRef<HTMLInputElement>(null)`  |
| **跨组件数据** | `provide/inject`                                 | `useContext`                                       |
| **自定义逻辑** | `function useCounter() {...}`                    | `function useCounter() {...}`（必须以 use 开头）   |

## 总结

### 核心差异

1. **响应式原理**：Vue 使用 Proxy，React 使用闭包 + 重渲染
2. **依赖追踪**：Vue 自动追踪，React 需要手动指定
3. **更新方式**：Vue 直接修改，React 通过 setState（批量更新）
4. **生命周期**：Vue 有独立的生命周期函数，React 统一用 useEffect

### setState 行为总结

| 场景                               | React 18+ 行为           | 说明                                      |
| ---------------------------------- | ------------------------ | ----------------------------------------- |
| **事件处理函数**                   | 批量更新（看起来像异步） | 多个 setState 会合并，只触发一次渲染      |
| **异步回调（setTimeout/Promise）** | 批量更新                 | React 18+ 自动批量处理                    |
| **原生事件监听器**                 | 批量更新                 | React 18+ 自动批量处理                    |
| **使用 flushSync**                 | 同步更新                 | 强制立即更新并渲染                        |
| **函数式更新**                     | 总是基于最新值           | `setCount(prev => prev + 1)` 避免闭包陷阱 |

**关键点**：

- React 18+ 中，setState 在大多数场景下都是**批量更新**的
- 不能依赖 setState 后立即读取到新值（除非使用 `flushSync`）
- **总是使用函数式更新**可以避免闭包陷阱，确保基于最新值更新

### 学习建议

1. **先理解闭包**：React Hooks 大量依赖闭包
2. **掌握依赖数组**：这是最容易出错的地方
3. **理解重渲染**：React 通过重渲染实现响应式
4. **实践项目**：通过实际项目加深理解

## 参考资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
