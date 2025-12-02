# 项目架构说明

## 目录结构设计

本项目采用工程化设计，考虑了从 SPA 扩展到 MPA 和 Subpackages 的可能性。

### 当前结构（SPA - 模块化路由）

```
react-spa-template/
├── entry/              # HTML 入口文件目录（生产环境 & 未来 MPA 使用）
│   └── index.html     # 主入口（打包阶段使用，可扩展更多 HTML）
├── index.html         # 开发环境默认入口（Vite 原生行为）
├── src/
│   ├── pages/         # 页面组件（当前扁平结构，未来可按包划分）
│   │   ├── Home/
│   │   └── User/
│   ├── router/        # 路由配置（已模块化）
│   │   ├── modules/   # 路由模块（按业务划分）
│   │   │   ├── home.ts      # 首页模块路由
│   │   │   ├── user.ts      # 用户模块路由
│   │   │   └── index.ts     # 路由合并
│   │   └── index.tsx        # 路由入口
│   ├── components/    # 公共组件
│   ├── utils/         # 工具函数
│   └── ...
└── ...
```

**说明**：
- 开发环境沿用 Vite 默认的根目录 `index.html`，保证开发体验和生态兼容。
- 生产环境（以及未来 MPA）通过 `entry/` 目录的 HTML 文件驱动，可按需新增多入口。
- **路由已模块化**：按业务模块拆分路由配置，便于维护和扩展。

### 未来扩展为 Subpackages 的结构

当需要扩展为 Subpackages（子包/分包）架构时，可以这样组织：

```
react-spa-template/
├── entry/
│   ├── index.html         # 主应用入口
│   ├── member.html        # 会员模块入口（可选）
│   └── admin.html         # 管理后台入口（可选）
├── src/
│   ├── packages/           # 业务包目录（按业务划分）
│   │   ├── main/          # 主应用包
│   │   │   ├── pages/     # 主应用页面
│   │   │   ├── router/    # 主应用路由
│   │   │   └── components/ # 主应用专用组件
│   │   ├── member/        # 会员模块包
│   │   │   ├── pages/
│   │   │   ├── router/
│   │   │   └── components/
│   │   └── admin/         # 管理后台包
│   │       ├── pages/
│   │       ├── router/
│   │       └── components/
│   ├── shared/            # 共享代码（所有包共用）
│   │   ├── components/    # 公共组件
│   │   ├── utils/         # 工具函数
│   │   ├── api/           # API 接口
│   │   └── ...
│   ├── router/            # 全局路由配置（SPA 模式）
│   │   └── modules/       # 路由模块
│   └── apps/              # 应用入口（MPA 模式使用）
│       ├── main.tsx
│       ├── member.tsx
│       └── admin.tsx
```

**详细说明请参考**：[Subpackages 架构设计文档](./docs/SUBPACKAGES_ARCHITECTURE.md)

## 扩展步骤

### 1. 修改 Vite 配置

在 `vite.config.ts` 中配置多入口：

```typescript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'entry/index.html'),
      member: resolve(__dirname, 'entry/member.html'),
      admin: resolve(__dirname, 'entry/admin.html'),
    },
  },
}
```

### 2. 创建新的入口 HTML

在 `entry/` 目录下创建新的 HTML 文件，例如 `member.html`：

```html
<!DOCTYPE html>
<html>
<head>
  <title>会员中心</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/apps/member.tsx"></script>
</body>
</html>
```

### 3. 创建对应的应用入口

在 `src/apps/` 目录下创建对应的应用入口文件。

### 4. 配置路由

每个应用可以有自己的路由配置，共享公共组件和工具。

## 代码组织原则

1. **共享代码**：组件、工具函数、类型定义等放在 `src/` 下，供所有应用共享
2. **页面隔离**：不同应用的页面放在 `src/pages/` 下的不同子目录
3. **配置分离**：每个应用的配置可以独立管理
4. **构建优化**：利用 Vite 的代码分割，按需加载不同应用的代码

## 开发建议

- 保持公共代码的可复用性
- 使用 TypeScript 确保类型安全
- 遵循统一的代码规范
- 合理使用路由懒加载优化性能

