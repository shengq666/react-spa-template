// 应用常量
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'React SPA Template',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  env: import.meta.env.VITE_ENV || 'development',
}

// API 配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
}

// 路由路径
export const ROUTE_PATH = {
  HOME: '/',
  USER: '/user',
  LOGIN: '/login',
  NOT_FOUND: '/404',
} as const

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME: 'theme',
} as const

