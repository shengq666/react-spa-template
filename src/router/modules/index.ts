import type { RouteConfig } from '@/types'
// 路由模块统一导出
import { homeRoutes } from './home'
import { themeRoutes } from './theme'
import { userRoutes } from './user'

// 合并所有模块路由
export const routeModules: RouteConfig[] = [
	...homeRoutes,
	...userRoutes,
	...themeRoutes,
	{
		path: '/404',
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
		redirect: '/404',
	},
]
