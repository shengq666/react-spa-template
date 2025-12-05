import type { RouteConfig } from '@/types'

// 主题演示模块路由
export const themeRoutes: RouteConfig[] = [
	{
		path: '/theme-demo', // 路由路径，用于 URL 映射和导航
		name: 'ThemeDemo', // 路由名称，仅用于标识，不用于导航
		meta: {
			title: '多主题演示',
			innerPage: true,
		},
		component: () => import('@/pages/ThemeDemo/index'),
	},
]
