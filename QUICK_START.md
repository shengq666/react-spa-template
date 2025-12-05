# 快速开始指南

## 📦 安装

### 前置要求

- Node.js >= 18
- pnpm >= 9

### 安装依赖

```bash
cd react-spa-template
pnpm install
```

## 🚀 启动项目

### 开发模式

```bash
pnpm dev
```

项目将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
pnpm preview
```

## 🛠️ 开发工具

### 代码检查

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix
```

### 代码格式化

```bash
# 格式化代码
pnpm format

# 检查格式
pnpm format:check
```

### 类型检查

```bash
pnpm type-check
```

## 📱 功能演示

### 首页 (Home)

- 展示文章列表
- 实时时间显示
- 工具函数演示（邮箱验证、数字格式化）
- 使用骨架屏加载效果
- 完整 HTTP 请求链路演示（loading + error + 埋点）
- 组件化拆分示例

### 用户页 (User)

- 用户信息展示
- 统计数据展示
- 工具函数演示（时间格式化、存储管理）
- 路由守卫演示（需要 token 才能访问）

### 主题演示页 (ThemeDemo)

- 多主题切换演示
- 主题持久化演示

## 🔧 环境变量配置

1. 复制环境变量示例文件：

```bash
cp .env.example .env.local
```

2. 根据需要修改 `.env.local` 中的配置

主要环境变量：

- `VITE_API_BASE_URL` - API 基础地址
- `VITE_VCONSOLE_ENABLED` - 是否启用 vConsole
- `VITE_PROXY_TARGET` - 代理目标地址（开发环境）

## 🎯 主要功能

### 路由系统

- ✅ HashRouter 路由模式
- ✅ 路由懒加载
- ✅ 路由守卫
- ✅ 404 处理
- ✅ 模块化路由配置（按业务划分）
- ✅ 扁平路由配置（推荐）

> 📖 **路由相关文档**：
>
> - [路由模块说明](./src/router/modules/README.md)
> - [React Router v7 迁移说明](./docs/ROUTER_V7_MIGRATION.md)
> - [路由配置方式对比](./docs/ROUTE_COMPARISON.md)

### HTTP 请求封装

- ✅ 单例/多实例模式
- ✅ 请求去重（自动取消重复请求）
- ✅ 统一错误处理
- ✅ 成功/失败消息提示
- ✅ Token 自动附加
- ✅ FormData 自动处理

> 📖 **HTTP 使用文档**：详细说明请参考 [HTTP 使用文档](./src/utils/http/README.md)

### 状态管理（Zustand）

- ✅ 轻量级状态管理
- ✅ 本地存储同步
- ✅ 异步 action 支持

> 📖 **Zustand 使用指南**：详细说明请参考 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)

### 工具库

- ✅ lodash-es - 工具函数（按需导入）
- ✅ dayjs - 日期处理
- ✅ classnames - 类名管理
- ✅ axios - HTTP 请求

> 📖 **Lodash 导入指南**：按需导入最佳实践请参考 [Lodash 导入指南](./docs/LODASH_IMPORT_GUIDE.md)

### 移动端适配

- ✅ postcss-mobile-forever 自动适配
- ✅ 响应式设计
- ✅ 触摸优化

### 调试工具

- ✅ vConsole 移动端调试
- ✅ 错误边界捕获
- ✅ 开发环境自动启用

### 主题系统

- ✅ 多主题支持
- ✅ 主题切换
- ✅ 主题持久化

> 📖 **主题配置指南**：详细说明请参考 [主题配置指南](./docs/THEME_GUIDE.md)

## 📝 代码规范

项目已配置：

- ESLint (基于 @antfu/eslint-config)
- Prettier
- Husky Git Hooks
- lint-staged

提交代码时会自动进行代码检查和格式化。

## 🎯 快速开发指南

### 1. 新增页面

参考 [README.md](./README.md) 中的"作为脚手架如何二次开发"章节。

> 📖 **页面组织**：详细说明请参考 [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md)

### 2. 新增路由

在 `src/router/modules/` 下创建新的路由模块文件。

> 📖 **路由配置**：详细说明请参考 [路由模块说明](./src/router/modules/README.md)

### 3. 使用 HTTP 请求

```typescript
import http from '@/utils/http'

// GET 请求
const result = await http.get('/api/user', { params: { id: 1 } })

// POST 请求
const result2 = await http.post('/api/user', { name: 'Tom' })
```

> 📖 **HTTP 使用**：详细说明请参考 [HTTP 使用文档](./src/utils/http/README.md)

### 4. 使用状态管理

```typescript
import { useUserStore } from '@/store/userStore'

const user = useUserStore(state => state.user)
const setUser = useUserStore(state => state.setUser)
```

> 📖 **Zustand 使用**：详细说明请参考 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)

### 5. 使用工具函数

```typescript
import { format, validate, storage, common } from '@/utils'

// 格式化
format.number(1234.56) // "1,234.56"
format.datetime(new Date()) // "2024-01-01 12:00:00"

// 验证
validate.email('test@example.com') // true

// 存储
storage.set('key', value)
storage.get('key')

// 通用工具
common.debounce(fn, 300)
common.sleep(1000)
```

## 🐛 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的 `server.port` 配置。

### 2. vConsole 未显示

检查 `.env.local` 中的 `VITE_VCONSOLE_ENABLED` 是否为 `true`。

### 3. 路由守卫不生效

检查 `src/router/modules/` 中对应路由模块的 `guard` 配置。

### 4. HTTP 请求失败

检查 `.env.local` 中的 `VITE_API_BASE_URL` 或 `VITE_PROXY_TARGET` 配置。

### 5. 主题切换不生效

检查 `src/theme/tokens.ts` 中的主题配置是否正确。

## 📚 更多文档

### 核心文档

- [README.md](./README.md) - 项目说明
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目完成总结

### 开发指南

- [页面目录组织指南](./docs/PAGE_ORGANIZATION_GUIDE.md) - 页面目录组织最佳实践
- [页面组织示例](./docs/PAGE_ORGANIZATION_EXAMPLE.md) - 多级嵌套页面示例
- [组件组织指南](./docs/COMPONENT_ORGANIZATION_GUIDE.md) - 组件组织最佳实践
- [React Hooks 指南](./docs/REACT_HOOKS_GUIDE.md) - 面向 Vue 开发者的 React Hooks 指南
- [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md) - Zustand 状态管理使用指南

### 路由相关

- [路由模块说明](./src/router/modules/README.md) - 路由模块使用说明
- [React Router v7 迁移说明](./docs/ROUTER_V7_MIGRATION.md) - React Router v7 迁移指南
- [路由配置方式对比](./docs/ROUTE_COMPARISON.md) - 路由配置方式对比分析

### HTTP 请求

- [HTTP 使用文档](./src/utils/http/README.md) - HTTP 请求封装使用文档

### 主题系统

- [主题配置指南](./docs/THEME_GUIDE.md) - 主题配置和使用指南

### 工具库

- [Lodash 导入指南](./docs/LODASH_IMPORT_GUIDE.md) - Lodash 按需导入最佳实践

### 构建与部署

- [构建命令指南](./docs/BUILD_COMMAND_GUIDE.md) - 构建命令详细说明

### React 版本

- [React 版本说明](./docs/REACT_VERSION_NOTE.md) - React 版本相关说明
- [React 19 使用指南](./docs/REACT_19_USAGE.md) - React 19 新特性使用指南

### 架构设计

- [Subpackages 架构设计](./docs/SUBPACKAGES_ARCHITECTURE.md) - Subpackages 架构设计文档
