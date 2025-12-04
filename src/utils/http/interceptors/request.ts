import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { handleFormDataContentType } from '../utils/formData'
import { attachToken } from '../utils/token'

/**
 * 请求拦截器：处理 token、FormData 等
 */
export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	// 调试：打印实际请求 URL
	if (import.meta.env.DEV) {
		const fullUrl = config.baseURL ? `${config.baseURL}${config.url || ''}` : config.url
		console.log('[HTTP Request]', {
			method: config.method?.toUpperCase(),
			url: config.url,
			baseURL: config.baseURL || '(empty)',
			fullUrl: fullUrl || '(empty)',
			willUseProxy: !config.baseURL && config.url?.startsWith('/api'),
		})
	}

	// 1. 添加 token
	attachToken(config)

	// 2. 处理 FormData
	handleFormDataContentType(config)

	return config
}

/**
 * 请求错误拦截器
 */
export function requestErrorInterceptor(error: AxiosError): Promise<never> {
	console.error('Request error:', error)
	return Promise.reject(error)
}
