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

## 📱 功能演示

### 首页 (Home)

- 展示文章列表
- 实时时间显示
- 工具函数演示（邮箱验证、数字格式化）
- 使用骨架屏加载效果

### 用户页 (User)

- 用户信息展示
- 统计数据展示
- 工具函数演示（时间格式化、存储管理）
- 路由守卫演示（需要 token 才能访问）

## 🔧 环境变量配置

1. 复制环境变量示例文件：

```bash
cp .env.example .env.local
```

2. 根据需要修改 `.env.local` 中的配置

## 🎯 主要功能

### 路由系统

- ✅ HashRouter 路由模式
- ✅ 路由懒加载
- ✅ 路由守卫
- ✅ 404 处理

### 工具库

- ✅ lodash-es - 工具函数
- ✅ dayjs - 日期处理
- ✅ classnames - 类名管理
- ✅ axios - HTTP 请求

### 移动端适配

- ✅ postcss-mobile-forever 自动适配
- ✅ 响应式设计
- ✅ 触摸优化

### 调试工具

- ✅ vConsole 移动端调试
- ✅ 错误边界捕获
- ✅ 开发环境自动启用

## 📝 代码规范

项目已配置：

- ESLint (基于 @antfu/eslint-config)
- Prettier
- Husky Git Hooks
- lint-staged

提交代码时会自动进行代码检查和格式化。

## 🐛 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的 `server.port` 配置。

### 2. vConsole 未显示

检查 `.env.local` 中的 `VITE_VCONSOLE_ENABLED` 是否为 `true`。

### 3. 路由守卫不生效

检查 `src/router/index.tsx` 中的路由守卫配置。

## 📚 更多文档

- [README.md](./README.md) - 项目说明
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构说明

