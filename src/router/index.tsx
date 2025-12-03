import { createHashRouter } from 'react-router-dom'
import { routeModules } from './modules'
import { convertRouteConfig } from './utils'
import type { RouteObject } from 'react-router-dom'

// 将自定义路由配置转换为 React Router 的 RouteObject
const routeObjects: RouteObject[] = routeModules
	.map(config => convertRouteConfig(config))
	.filter((route): route is RouteObject => route !== null)

// 使用 createHashRouter 创建路由实例（React Router v7 推荐方式）
export const router = createHashRouter(routeObjects)

// 导出路由实例，供 RouterProvider 使用
export default router
