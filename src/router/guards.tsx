import React, { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loading } from '@/components/Loading'
import type { RouteConfig } from '@/types'

// 懒加载包装器
export function LazyLoad(Component: React.LazyExoticComponent<React.ComponentType<any>>) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

// 路由守卫 Layout（需要认证的路由）
export function AuthGuard() {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    // 未登录，重定向到登录页，并记录当前位置以便登录后跳回
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 已登录，渲染子路由
  return <Outlet />
}

// 通用路由守卫（支持自定义 guard 函数）
export function createGuardWrapper(guard?: RouteConfig['guard']) {
  return function GuardWrapper({ children }: { children: React.ReactNode }) {
    const [allowed, setAllowed] = React.useState<boolean | null>(null)
    const location = useLocation()

    React.useEffect(() => {
      if (guard) {
        const checkGuard = async () => {
          try {
            // 构造路由对象用于 guard 函数
            const route: RouteConfig = {
              path: location.pathname,
            }
            const result = await guard(route)
            setAllowed(result)
          }
          catch (error) {
            console.error('Route guard error:', error)
            setAllowed(false)
          }
        }
        checkGuard()
      }
      else {
        setAllowed(true)
      }
    }, [guard, location.pathname])

    if (allowed === null) {
      return <Loading tip="检查权限中..." />
    }

    if (!allowed) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
  }
}

