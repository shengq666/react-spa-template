import { ROUTE_PATH } from '@/constants'
import type { RouteConfig } from '@/types'

// 用户模块路由
export const userRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATH.USER,
    name: 'User',
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
