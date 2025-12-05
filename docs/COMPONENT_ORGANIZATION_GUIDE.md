# React 组件组织最佳实践

> 本文档说明在 React 项目中如何组织组件和业务逻辑，包括容器组件模式、自定义 Hooks、以及何时将逻辑放在组件内部。

## 核心原则

### 1. 容器组件 vs 展示组件（Container/Presentational Pattern）

**展示组件（Presentational）**：

- 只负责 UI 展示
- 通过 props 接收数据和回调
- 不关心数据来源和业务逻辑
- 可复用性强

**容器组件（Container）**：

- 管理状态和业务逻辑
- 处理数据获取和副作用
- 将数据通过 props 传递给展示组件

### 2. 判断标准

| 场景                             | 推荐做法                | 原因                      |
| -------------------------------- | ----------------------- | ------------------------- |
| **逻辑完全独立，不依赖外部状态** | 放到组件内部            | 提高组件独立性和复用性    |
| **逻辑需要访问父组件状态**       | 放在父组件或自定义 Hook | 便于状态管理和数据流追踪  |
| **逻辑可能被多个组件复用**       | 抽取到自定义 Hook       | 代码复用，避免重复        |
| **逻辑简单，只是格式化/展示**    | 放到组件内部            | 减少 props 传递，简化代码 |

## 实际案例分析

### 当前 Home 页面的实现

```tsx
// index.tsx - 容器组件（管理所有状态和逻辑）
function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = useUserStore(state => state.user)

  // 所有业务逻辑都在这里
  const handleThemeChange = (newThemeId: BrandId) => {
    setThemeId(newThemeId)
    Toast.show({ content: `已切换到 ${newThemeId} 主题` })
  }

  const handleFetchUserInfo = async () => {
    await fetchCurrentUser()
    // ...
  }

  return (
    <AppStatusCard themeId={themeId} onThemeChange={handleThemeChange} />
    <UserStatusCard user={user} onFetchUser={handleFetchUserInfo} />
  )
}
```

### 方案对比

#### 方案 A：当前做法（逻辑在父组件）✅ 适合当前场景

**优点**：

- 状态集中管理，便于调试
- 数据流清晰，易于追踪
- 适合需要跨组件共享状态的场景

**缺点**：

- 父组件可能变得臃肿
- 组件复用性较差（依赖父组件传入逻辑）

**适用场景**：

- 逻辑需要访问多个 store 或状态
- 需要跨组件协调（如错误处理、loading 状态）
- 页面级的状态管理

#### 方案 B：逻辑放到组件内部 ✅ 适合独立逻辑

**示例**：

```tsx
// AppStatusCard.tsx - 逻辑内聚
export function AppStatusCard() {
	// 组件内部直接使用 store
	const appReady = useAppStore(state => state.appReady)
	const globalLoading = useAppStore(state => state.globalLoading)
	const themeId = useAppStore(state => state.themeId)
	const setThemeId = useAppStore(state => state.setThemeId)

	// 逻辑完全在组件内部
	const handleThemeToggle = () => {
		const allIds = BRAND_OPTIONS.map(item => item.id)
		const current = themeId || 'brand1'
		const candidates = allIds.filter(id => id !== current)
		const nextTheme = candidates[Math.floor(Math.random() * candidates.length)] || current

		setThemeId(nextTheme)
		applyTheme(nextTheme)
		Toast.show({ content: `已切换到 ${nextTheme} 主题` })
	}

	return (
		<Card>
			<Tag>App Ready: {appReady ? '是' : '否'}</Tag>
			<Button onClick={handleThemeToggle}>切换主题</Button>
		</Card>
	)
}
```

**优点**：

- 组件独立性强，复用性好
- 父组件更简洁
- 逻辑内聚，易于理解

**缺点**：

- 如果逻辑需要跨组件协调，会有问题
- 组件与 store 耦合，测试需要 mock store

**适用场景**：

- 逻辑完全独立，不依赖外部状态
- 组件可以在多个页面复用
- 逻辑简单，主要是展示和交互

#### 方案 C：自定义 Hook ✅ 最佳实践

**示例**：

```tsx
// hooks/useAppStatus.ts - 抽取业务逻辑
export function useAppStatus() {
	const appReady = useAppStore(state => state.appReady)
	const globalLoading = useAppStore(state => state.globalLoading)
	const themeId = useAppStore(state => state.themeId)
	const setThemeId = useAppStore(state => state.setThemeId)

	const handleThemeChange = useCallback(
		(newThemeId: BrandId) => {
			setThemeId(newThemeId)
			applyTheme(newThemeId)
			Toast.show({ content: `已切换到 ${newThemeId} 主题` })
		},
		[setThemeId],
	)

	return {
		appReady,
		globalLoading,
		themeId,
		handleThemeChange,
	}
}

// AppStatusCard.tsx - 使用自定义 Hook
export function AppStatusCard() {
	const { appReady, globalLoading, themeId, handleThemeChange } = useAppStatus()

	return (
		<Card>
			<Tag>App Ready: {appReady ? '是' : '否'}</Tag>
			<Button onClick={() => handleThemeChange('brand1')}>切换主题</Button>
		</Card>
	)
}
```

**优点**：

- 逻辑复用性强
- 组件和逻辑分离，易于测试
- 符合单一职责原则

**缺点**：

- 需要额外的文件组织
- 简单场景可能过度设计

**适用场景**：

- 逻辑可能被多个组件复用
- 逻辑复杂，需要单独测试
- 需要保持组件简洁

## 推荐的重构方案

### 1. 独立逻辑 → 组件内部

**适合的组件**：

- `AnalyticsCard`：埋点逻辑完全独立
- `ActionButtons`：工具函数调用，逻辑简单

```tsx
// AnalyticsCard.tsx - 逻辑内聚
export function AnalyticsCard() {
	const handleReport = () => {
		reportEvent('home_manual_action', { ts: Date.now() })
		Toast.show({ content: '已触发示例埋点（控制台可见）' })
	}

	return (
		<Card>
			<Button onClick={handleReport}>触发埋点事件</Button>
		</Card>
	)
}
```

### 2. 需要 store 的逻辑 → 自定义 Hook

**适合的组件**：

- `AppStatusCard`：需要访问多个 store 状态
- `UserStatusCard`：需要访问 userStore

```tsx
// hooks/useAppStatus.ts
export function useAppStatus() {
	const appReady = useAppStore(state => state.appReady)
	const globalLoading = useAppStore(state => state.globalLoading)
	const themeId = useAppStore(state => state.themeId)
	const setThemeId = useAppStore(state => state.setThemeId)

	const handleThemeChange = useCallback(
		(newThemeId: BrandId) => {
			const allIds = BRAND_OPTIONS.map(item => item.id)
			const current = themeId || 'brand1'
			const candidates = allIds.filter(id => id !== current)
			const nextTheme = candidates[Math.floor(Math.random() * candidates.length)] || current

			setThemeId(nextTheme)
			applyTheme(nextTheme)
			Toast.show({ content: `已切换到 ${nextTheme} 主题` })
		},
		[themeId, setThemeId],
	)

	return { appReady, globalLoading, themeId, handleThemeChange }
}
```

### 3. 页面级逻辑 → 保留在父组件

**适合的逻辑**：

- 页面初始化（`fetchBannerWithDemo`）
- 跨组件的错误处理
- 页面级的状态管理（loading、error）

```tsx
// index.tsx - 保留页面级逻辑
function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 页面初始化逻辑
  const fetchBannerWithDemo = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getHomePageBannerList({...})
      reportEvent('home_banner_loaded', {...})
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBannerWithDemo()
  }, [])

  return (
    <>
      {error && <ErrorView error={error} onRetry={fetchBannerWithDemo} />}
      <AppStatusCard /> {/* 逻辑在组件内部或 Hook */}
      <UserStatusCard /> {/* 逻辑在组件内部或 Hook */}
    </>
  )
}
```

## 决策树

```
逻辑是否需要访问外部状态？
├─ 否 → 放到组件内部 ✅
│
└─ 是 → 逻辑是否可能被多个组件复用？
    ├─ 是 → 抽取到自定义 Hook ✅
    │
    └─ 否 → 逻辑是否需要跨组件协调？
        ├─ 是 → 保留在父组件 ✅
        │
        └─ 否 → 放到组件内部或自定义 Hook ✅
```

## 最佳实践总结

### ✅ 推荐做法

1. **简单展示逻辑** → 组件内部

   ```tsx
   const handleClick = () => Toast.show({ content: '点击了' })
   ```

2. **需要 store 的独立逻辑** → 组件内部直接使用 store

   ```tsx
   const user = useUserStore(state => state.user)
   const handleClear = () => useUserStore.getState().clearUser()
   ```

3. **可复用的复杂逻辑** → 自定义 Hook

   ```tsx
   const { themeId, handleThemeChange } = useAppStatus()
   ```

4. **页面级协调逻辑** → 父组件
   ```tsx
   // 跨组件的 loading、error 处理
   ```

### ❌ 避免的做法

1. **过度拆分**：简单逻辑也抽取到父组件
2. **逻辑分散**：相关逻辑分散在多个地方
3. **过度耦合**：组件与父组件状态强耦合

## 重构建议

对于当前的 Home 页面，建议：

1. **`AnalyticsCard`** → 逻辑放到组件内部（完全独立）
2. **`ActionButtons`** → 逻辑放到组件内部（简单工具函数调用）
3. **`AppStatusCard`** → 使用自定义 Hook `useAppStatus`（需要多个 store）
4. **`UserStatusCard`** → 组件内部直接使用 `useUserStore`（只依赖一个 store）
5. **`Home/index.tsx`** → 只保留页面级逻辑（初始化、错误处理）

这样既保持了组件的独立性，又避免了父组件过于臃肿。

## 参考资源

- [React 官方：组件设计原则](https://react.dev/learn/thinking-in-react)
- [Container/Presentational Pattern](https://www.patterns.dev/react/presentational-container-pattern)
- [Custom Hooks 最佳实践](https://react.dev/learn/reusing-logic-with-custom-hooks)
