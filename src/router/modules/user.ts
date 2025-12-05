import type { RouteConfig } from '@/types'

// 用户模块路由
export const userRoutes: RouteConfig[] = [
	{
		path: '/user', // 路由路径，用于 URL 映射和导航
		name: 'User', // 路由名称，仅用于标识，不用于导航
		meta: {
			title: '用户中心',
			innerPage: true,
			requiresAuth: true,
		},
		component: () => import('@/pages/User/index'),
		// guard: async () => {
		//   // 路由守卫：检查用户是否登录
		//   const token = localStorage.getItem('token')
		//   if (!token) {
		//     return false
		//   }
		//   return true
		// },
	},
]
