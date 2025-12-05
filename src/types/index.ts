// 通用类型定义
export interface ApiResponse<T = any> {
	code: number
	data: T
	message: string
}

export interface PaginationParams {
	page: number
	pageSize: number
}

export interface PaginationResponse<T> {
	list: T[]
	total: number
	page: number
	pageSize: number
}

// 路由元信息类型
export interface RouteMeta {
	title?: string
	requiresAuth?: boolean
	innerPage?: boolean
	[key: string]: any
}

// 路由配置类型（类似 Vue Router，支持 v7 新特性）
export interface RouteConfig {
	/** 路由路径，用于 URL 映射和导航（必须） */
	path: string
	/** 路由名称，仅用于标识和文档，不用于导航（可选） */
	name?: string
	/** 路由元信息（可选） */
	meta?: RouteMeta
	component?: () => Promise<{ default: React.ComponentType<any> }>
	element?: React.ReactNode
	children?: RouteConfig[]
	redirect?: string
	guard?: (to: RouteConfig, from?: RouteConfig) => boolean | Promise<boolean>
	// React Router v7 新特性
	loader?: () => Promise<any> | any
	action?: () => Promise<any> | any
	/** 用于 React Router 的错误边界展示组件 */
	errorElement?: React.ReactNode
}

// 用户信息类型
export interface UserInfo {
	id: string | number
	username: string
	avatar?: string
	email?: string
	[key: string]: any
}
