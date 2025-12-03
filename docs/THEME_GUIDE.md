# 多主题系统使用指南

## 概述

本项目采用基于 **SCSS 文件 + CSS 类切换** 的多主题系统，支持运行时动态切换主题，完全模块化设计。

## 架构设计

### 核心思路

- **每个主题一个独立的 SCSS 文件**：`src/styles/theme/*.scss`
- **通过 CSS class 切换主题**：运行时动态切换 `html` 和 `body` 的 `theme-xxx` class
- **所有主题在构建时打包**：Vite 会将所有主题文件打包，运行时只需切换 class，性能优秀
- **完全基于 CSS 变量**：颜色、背景等样式通过 CSS 变量定义，自动跟随主题切换

### 文件结构

```
src/
├── theme/                          # 主题系统核心模块
│   ├── tokens.ts                   # 主题类型定义和工具函数
│   ├── applyTheme.ts               # 主题应用逻辑（切换 class）
│   ├── useTheme.ts                 # React Hook（Zustand 状态管理）
│   └── antd-overrides.scss         # antd-mobile 组件样式覆盖（可选）
├── styles/
│   ├── theme/                      # 主题样式文件目录
│   │   ├── default.scss            # 默认主题
│   │   ├── brand1.scss             # 品牌一主题
│   │   └── brand2.scss             # 品牌二主题
│   ├── variables.scss              # 全局非主题变量（间距、字体、圆角等）
│   └── index.scss                  # 样式入口（统一引入所有主题文件）
```

## 添加新主题

### 1. 创建主题 SCSS 文件

在 `src/styles/theme/` 目录下创建新的主题文件，例如 `brand3.scss`：

```scss
// 品牌三主题
.theme-brand3 {
  // 自定义 CSS 变量
  --primary-color: #your-color;
  --success-color: #your-color;
  --warning-color: #your-color;
  --error-color: #your-color;
  --text-color: #your-color;
  --text-color-secondary: #your-color;
  --border-color: #your-color;
  --bg-color: #your-color;
  --bg-color-secondary: #your-color;

  // antd-mobile 官方 CSS 变量（参考官方文档）
  --adm-color-primary: #your-color;
  --adm-color-success: #your-color;
  --adm-color-warning: #your-color;
  --adm-color-danger: #your-color;
  --adm-color-white: #ffffff;
  --adm-color-text: #your-color;
  --adm-color-text-secondary: #your-color;
  --adm-color-weak: #999999;
  --adm-color-light: #cccccc;
  --adm-color-border: #eeeeee;
  --adm-color-box: #your-color;
  --adm-color-background: #your-color;
}
```

### 2. 在样式入口引入

在 `src/styles/index.scss` 中引入新主题文件：

```scss
@use './theme/default.scss';
@use './theme/brand1.scss';
@use './theme/brand2.scss';
@use './theme/brand3.scss';  // 新增
```

### 3. 更新类型定义

在 `src/theme/tokens.ts` 中添加新的品牌 ID：

```typescript
export type BrandId = 'default' | 'brand1' | 'brand2' | 'brand3'  // 新增
```

### 4. 更新品牌选项

在 `src/theme/tokens.ts` 的 `BRAND_OPTIONS` 中添加新品牌：

```typescript
export const BRAND_OPTIONS: { id: BrandId; name: string }[] = [
  { id: 'default', name: '默认主题' },
  { id: 'brand1', name: '品牌一' },
  { id: 'brand2', name: '品牌二' },
  { id: 'brand3', name: '品牌三' },  // 新增
]
```

### 5. 更新主题应用逻辑

在 `src/theme/applyTheme.ts` 的 `themeClasses` 数组中添加新的主题 class：

```typescript
const themeClasses = ['theme-default', 'theme-brand1', 'theme-brand2', 'theme-brand3']  // 新增
```

完成以上步骤后，新主题即可使用。

## 修改现有主题

直接编辑对应的主题 SCSS 文件即可，例如修改 `src/styles/theme/brand1.scss`：

```scss
.theme-brand1 {
  --primary-color: #new-color;  // 修改颜色值
  // ... 其他变量
}
```

保存后，主题会自动更新（热更新），无需重启开发服务器。

## 使用主题

### 在 React 组件中使用

```tsx
import { useTheme } from '@/theme/useTheme'

function MyComponent() {
  const { brandId, setBrand } = useTheme()

  const handleSwitchTheme = () => {
    setBrand('brand1')  // 切换主题
  }

  return (
    <div>
      <p>当前主题: {brandId}</p>
      <button onClick={handleSwitchTheme}>切换主题</button>
    </div>
  )
}
```

### 在 SCSS 中使用主题变量

```scss
.my-component {
  color: var(--text-color);              // 使用主题文本颜色
  background: var(--bg-color);           // 使用主题背景颜色
  border: 1px solid var(--border-color); // 使用主题边框颜色
}
```

### 通过 URL 参数初始化主题

支持通过 URL 参数 `brandId` 初始化主题，例如：

```
/#/theme-demo?brandId=brand1
```

在页面组件中读取 URL 参数并设置主题：

```tsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTheme } from '@/theme/useTheme'
import { isValidBrandId } from '@/theme/tokens'
import { BRAND_QUERY_KEY } from '@/constants'

function MyPage() {
  const [searchParams] = useSearchParams()
  const { brandId, setBrand } = useTheme()

  useEffect(() => {
    const brandFromUrl = searchParams.get(BRAND_QUERY_KEY)
    if (isValidBrandId(brandFromUrl) && brandFromUrl !== brandId) {
      setBrand(brandFromUrl)
    }
  }, [])

  return <div>...</div>
}
```

## 主题变量说明

### 自定义 CSS 变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `--primary-color` | 主色 | `#1677ff` |
| `--success-color` | 成功色 | `#52c41a` |
| `--warning-color` | 警告色 | `#faad14` |
| `--error-color` | 错误色 | `#ff4d4f` |
| `--text-color` | 文本颜色 | `#333333` |
| `--text-color-secondary` | 次要文本颜色 | `#666666` |
| `--border-color` | 边框颜色 | `#e5e5e5` |
| `--bg-color` | 背景颜色 | `#ffffff` |
| `--bg-color-secondary` | 次要背景颜色 | `#f5f5f5` |

### antd-mobile CSS 变量

项目支持 antd-mobile 官方的 CSS 变量体系，详见 [antd-mobile 主题定制文档](https://mobile.ant.design/zh/guide/theming)。

常用变量：

| 变量名 | 说明 |
|--------|------|
| `--adm-color-primary` | 主色 |
| `--adm-color-success` | 成功色 |
| `--adm-color-warning` | 警告色 |
| `--adm-color-danger` | 危险色 |
| `--adm-color-text` | 文本颜色 |
| `--adm-color-background` | 背景颜色 |
| `--adm-color-box` | 盒子背景颜色 |

完整变量列表请参考 antd-mobile 官方文档。

## 工作原理

### 主题切换流程

1. **用户调用 `setBrand(brandId)`**
   - 更新 Zustand 状态
   - 保存到 localStorage
   - 调用 `applyTheme(brandId)`

2. **`applyTheme(brandId)` 执行**
   - 移除所有主题 class（`theme-default`, `theme-brand1`, `theme-brand2`）
   - 添加当前主题 class（如 `theme-brand1`）
   - 同时添加到 `html` 和 `body` 元素

3. **CSS 变量生效**
   - SCSS 文件中定义的 `.theme-xxx` 下的 CSS 变量自动生效
   - 所有使用这些变量的样式自动更新

### 构建时 vs 运行时

- **构建时**：Vite 将所有主题 SCSS 文件打包到 CSS 中
- **运行时**：只需切换 DOM 元素的 class，无需重新加载资源，性能优秀

## 最佳实践

### 1. 主题变量命名

- 使用语义化的变量名（如 `--primary-color` 而非 `--color-1`）
- 保持自定义变量和 antd 变量的命名一致（便于维护）

### 2. 颜色选择

- 确保文本颜色和背景颜色有足够的对比度（符合 WCAG 标准）
- 保持品牌一致性

### 3. 样式覆盖

如果需要覆盖 antd-mobile 组件的样式，统一在 `src/theme/antd-overrides.scss` 中处理：

```scss
.adm-button {
  border-radius: var(--border-radius-md);
}

.adm-list {
  background-color: var(--bg-color);
}
```

### 4. 主题持久化

主题选择会自动保存到 `localStorage`，下次访问时会自动恢复。如果需要禁用持久化，可以修改 `src/theme/useTheme.ts`。

## 常见问题

### Q: 如何删除一个主题？

A: 
1. 删除对应的 SCSS 文件（如 `src/styles/theme/brand3.scss`）
2. 从 `src/styles/index.scss` 中移除引入
3. 从 `src/theme/tokens.ts` 的类型和选项中移除
4. 从 `src/theme/applyTheme.ts` 的 `themeClasses` 中移除

### Q: 为什么我的主题颜色没有生效？

A: 检查以下几点：
1. 主题 SCSS 文件是否正确引入到 `src/styles/index.scss`
2. 主题 class 名称是否正确（必须匹配 `theme-${brandId}` 格式）
3. CSS 变量名是否正确（区分大小写）
4. 浏览器控制台是否有 CSS 错误

### Q: 可以动态加载主题文件吗？

A: 当前实现是构建时打包所有主题，运行时切换 class。如果需要在运行时动态加载主题文件，需要修改构建配置和主题应用逻辑，但会带来额外的性能开销，不推荐。

### Q: 如何支持暗色模式？

A: 可以创建一个 `dark.scss` 主题文件，定义暗色变量，然后通过用户设置或系统偏好来切换主题。

## 参考资源

- [antd-mobile 主题定制文档](https://mobile.ant.design/zh/guide/theming)
- [CSS 变量 MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

