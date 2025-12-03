import { ROUTE_PATH } from '@/constants'
import type { RouteConfig } from '@/types'

// 首页模块路由
export const homeRoutes: RouteConfig[] = [
	{
		path: ROUTE_PATH.HOME,
		name: 'Home',
		meta: {
			title: '首页',
			innerPage: false,
		},
		component: () => import('@/pages/Home/index'),
	},
]
