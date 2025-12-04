import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { HttpRequestConfig } from '../types'
import { handleFormDataContentType } from '../utils/formData'
import { extractCustomOptions } from '../utils/options'
import { beforeRequestHook } from '../utils/requestHook'
import { attachToken } from '../utils/token'

/**
 * 请求拦截器：处理 token、FormData 等
 * 注意：请求取消处理在 core.ts 中通过闭包访问 axiosCanceler
 */
export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	const httpConfig = config as HttpRequestConfig
	const requestOptions = httpConfig.requestOptions
	const options = extractCustomOptions(requestOptions)

	// 调试：打印实际请求 URL
	if (import.meta.env.DEV) {
		const fullUrl = config.baseURL ? `${config.baseURL}${config.url || ''}` : config.url
		// eslint-disable-next-line no-console
		console.log('[HTTP Request]', {
			method: config.method?.toUpperCase(),
			url: config.url,
			baseURL: config.baseURL || '(empty)',
			fullUrl: fullUrl || '(empty)',
			willUseProxy: !config.baseURL && config.url?.startsWith('/api'),
		})
	}

	// 1. 请求前钩子处理（URL 前缀、参数格式化、时间戳等）
	beforeRequestHook(config, options)

	// 2. 添加 token
	attachToken(config)

	// 3. 处理 FormData
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
