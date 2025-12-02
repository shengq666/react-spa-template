// 路由模块统一导出
import { homeRoutes } from './home'
import { userRoutes } from './user'
import type { RouteConfig } from '@/types'

// 合并所有模块路由
export const routeModules: RouteConfig[] = [
  ...homeRoutes,
  ...userRoutes,
  // 404 重定向（放在最后）
  {
    path: '*',
    redirect: '/',
  },
]

