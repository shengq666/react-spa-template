import { API_CONFIG } from '@/constants'
import { createHttp } from './core'

// 导出常量
export { codeMessage, ResponseCode } from './constants'

// 导出类型
export type { BasicResponse, HttpRequestConfig, RequestOptions } from './types'

// 导出工厂方法
export { createHttp }

// 创建默认 HTTP 实例（使用全局 API_CONFIG）
export const http = createHttp({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
	},
})

// 默认导出，保持向后兼容
export default http
