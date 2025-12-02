# 更新日志

## [1.1.0] - 2024-12-02

### ✨ 更新

- **React**: 升级到 19.0.0（最新正式版，支持 use API 和 Suspense）
- **React Router**: 升级到 7.9.0（最新正式版）
- **React 类型定义**: 升级到 19.0.0
- **@vitejs/plugin-react**: 升级到 4.3.3

### 🔧 修复

- **antd-mobile React 19 兼容性**：使用 `unstableSetRender` API 解决兼容性问题
  - 创建 `src/utils/react19-compat.ts` 兼容性配置
  - 在 `main.tsx` 中初始化兼容性配置
  - 解决了 `unmountComponentAtNode is not a function` 错误

### 📝 说明

#### React 19 新特性

React 19 引入了 `use` API，可以与 `Suspense` 配合，写出更简洁的声明式异步数据获取代码：

```tsx
import { use, Suspense } from 'react'

function UserProfile({ userPromise }) {
  const user = use(userPromise)  // 直接使用 Promise，无需 useState + useEffect
  return <div>{user.name}</div>
}
```

详细说明请参考：[React 版本说明](./docs/REACT_VERSION_NOTE.md)

### 🔧 修复

- **Sass @import 废弃警告**: 将所有 `@import` 替换为 `@use`，解决 Dart Sass 3.0.0 兼容性问题
  - `src/styles/index.scss`: 使用 `@use` 替代 `@import`
  - `vite.config.ts`: 在 `additionalData` 中使用 `@use` 替代 `@import`

- **Sass Legacy JS API 废弃警告**: 配置使用现代编译器 API
  - `vite.config.ts`: 添加 `api: 'modern-compiler'` 配置，使用 Dart Sass 现代 JS API，避免 legacy JS API 警告

### 📝 说明

#### Sass @import 迁移

Sass 的 `@import` 规则已被废弃，将在 Dart Sass 3.0.0 中移除。项目已迁移到新的模块系统：

- **之前**:
  ```scss
  @import './variables.scss';
  ```

- **现在**:
  ```scss
  @use './variables.scss';
  ```

`@use` 规则提供了更好的模块化和命名空间管理，避免全局作用域污染。

#### React 19 新特性

React 19 带来了以下改进：
- 更好的服务器组件支持
- 改进的并发特性
- 新的 Hooks API
- 性能优化

#### React Router 7.9 更新

React Router 7.9 包含：
- 更好的类型支持
- 性能优化
- Bug 修复

---

## [1.0.0] - 2024-12-02

### 🎉 初始版本

- 完整的项目模板创建
- 所有核心功能实现

