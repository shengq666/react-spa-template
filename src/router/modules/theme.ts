import { ROUTE_PATH } from '@/constants'
import type { RouteConfig } from '@/types'

// 主题演示模块路由
export const themeRoutes: RouteConfig[] = [
	{
		path: ROUTE_PATH.THEME_DEMO,
		name: 'ThemeDemo',
		meta: {
			title: '多主题演示',
			innerPage: true,
		},
		component: () => import('@/pages/ThemeDemo/index'),
	},
]
