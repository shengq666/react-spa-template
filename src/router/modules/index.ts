// 路由模块统一导出
import { homeRoutes } from './home'
import { userRoutes } from './user'
import { ROUTE_PATH } from '@/constants'
import type { RouteConfig } from '@/types'

// 合并所有模块路由
export const routeModules: RouteConfig[] = [
	...homeRoutes,
	...userRoutes,
	{
		path: ROUTE_PATH.NOT_FOUND,
		name: 'NotFound',
		meta: {
			title: '页面不存在',
			innerPage: true,
		},
		component: () => import('@/pages/NotFound'),
	},
	// 404 通配符重定向（放在最后）
	{
		path: '*',
		redirect: ROUTE_PATH.NOT_FOUND,
	},
]
