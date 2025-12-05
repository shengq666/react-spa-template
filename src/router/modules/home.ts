import type { RouteConfig } from '@/types'

// 首页模块路由
export const homeRoutes: RouteConfig[] = [
	{
		path: '/', // 路由路径，用于 URL 映射和导航
		name: 'Home', // 路由名称，仅用于标识，不用于导航
		meta: {
			title: '首页',
			innerPage: false,
		},
		component: () => import('@/pages/Home/index'),
	},
]
