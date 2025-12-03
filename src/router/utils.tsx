import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { RouteConfig } from '@/types'
import { LazyLoad, createGuardWrapper } from './guards'

/**
 * 将自定义的 RouteConfig 转换为 React Router 的 RouteObject
 */
export function convertRouteConfig(config: RouteConfig): RouteObject | null {
	// 重定向路由
	if (config.redirect) {
		return {
			path: config.path,
			element: <Navigate to={config.redirect} replace />,
		}
	}

	// 有 component 的路由（懒加载）
	if (config.component) {
		const LazyComponent = React.lazy(config.component)
		const element = LazyLoad(LazyComponent)

		// 如果有守卫，需要包装
		if (config.guard) {
			const GuardWrapper = createGuardWrapper(config.guard)
			return {
				path: config.path,
				element: <GuardWrapper>{element}</GuardWrapper>,
				// 支持 v7 新特性：loader 和 action
				loader: config.loader,
				action: config.action,
			}
		}

		return {
			path: config.path,
			element,
			loader: config.loader,
			action: config.action,
		}
	}

	// 直接使用 element 的路由
	if (config.element) {
		if (config.guard) {
			const GuardWrapper = createGuardWrapper(config.guard)
			return {
				path: config.path,
				element: <GuardWrapper>{config.element}</GuardWrapper>,
				loader: config.loader,
				action: config.action,
			}
		}

		return {
			path: config.path,
			element: config.element,
			loader: config.loader,
			action: config.action,
		}
	}

	// 有子路由的情况
	if (config.children && config.children.length > 0) {
		const children = config.children
			.map(child => convertRouteConfig(child))
			.filter((route): route is RouteObject => route !== null)

		const routeObject: RouteObject = {
			path: config.path,
			children,
			loader: config.loader,
			action: config.action,
		}

		// 如果有守卫，包装整个路由组
		if (config.guard) {
			const GuardWrapper = createGuardWrapper(config.guard)
			routeObject.element = (
				<GuardWrapper>
					<Outlet />
				</GuardWrapper>
			)
		}

		return routeObject
	}

	return null
}
