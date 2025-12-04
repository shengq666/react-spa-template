// 应用常量
export const APP_CONFIG = {
	title: import.meta.env.VITE_APP_TITLE || 'React SPA Template',
	version: import.meta.env.VITE_APP_VERSION || '1.0.0',
	env: import.meta.env.VITE_ENV || 'development',
}

// API 配置
export const API_CONFIG = {
	// 开发环境下，如果设置了完整 URL，需要设置为空以使用 Vite 代理
	// 生产环境下，使用环境变量中的 baseURL
	baseURL: '',
	timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
}

// 路由路径
export const ROUTE_PATH = {
	HOME: '/',
	USER: '/user',
	LOGIN: '/login',
	NOT_FOUND: '/404',
	THEME_DEMO: '/theme-demo',
} as const

// 品牌主题相关（用于多主题切换）
export const BRAND_QUERY_KEY = 'brandId'

// 存储键名
export const STORAGE_KEYS = {
	TOKEN: 'token',
	USER_INFO: 'userInfo',
	THEME: 'theme',
} as const
