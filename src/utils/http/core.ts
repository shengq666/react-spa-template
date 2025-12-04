import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { HttpRequestConfig, RequestOptions } from './types'
import axios from 'axios'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../storage'
import { transformError, transformResponse } from './transform'

/**
 * 创建 HTTP 请求实例的工厂函数
 *
 * @param baseConfig axios 实例级配置（baseURL、timeout、headers 等）
 * @returns 配置好的 axios 实例和请求方法
 *
 * @example
 * ```ts
 * // 创建默认实例
 * const http = createHttp({ baseURL: 'https://api.example.com' })
 *
 * // 创建多实例（多域名场景）
 * const uploadHttp = createHttp({ baseURL: 'https://upload.example.com', timeout: 30000 })
 * ```
 */
export function createHttp(baseConfig?: AxiosRequestConfig) {
	// 创建 axios 实例
	const instance: AxiosInstance = axios.create(baseConfig)

	// 请求拦截器
	instance.interceptors.request.use(
		config => {
			// 添加 token
			const token = storage.get<string>(STORAGE_KEYS.TOKEN)
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`
			}
			return config
		},
		(error: AxiosError) => {
			console.error('Request error:', error)
			return Promise.reject(error)
		},
	)

	// 响应拦截器
	instance.interceptors.response.use(transformResponse, transformError)

	/**
	 * 核心请求方法
	 * 支持两种调用方式：
	 * 1. 单个参数：request(config) - 兼容 axios 标准用法
	 * 2. 两个参数：request(config, options) - 推荐用法，分离 axios 配置和自定义选项
	 *
	 * @example
	 * ```ts
	 * // 方式1: 单个参数（兼容 axios 标准用法）
	 * http.request({
	 *   url: '/api/user',
	 *   method: 'get',
	 *   params: { id: 1 },
	 *   timeout: 5000
	 * })
	 *
	 * // 方式2: URL + 配置对象（兼容 axios 标准用法）
	 * http.request('/api/user', {
	 *   method: 'get',
	 *   params: { id: 1 },
	 *   timeout: 5000
	 * })
	 *
	 * // 方式3: 两个参数（推荐用法）
	 * // 第一个参数：所有 axios 原生配置
	 * // 第二个参数：自定义行为开关（RequestOptions）
	 * http.request(
	 *   {
	 *     url: '/api/user',
	 *     method: 'get',
	 *     params: { id: 1 },
	 *     timeout: 5000,
	 *     headers: { 'X-Custom': 'value' }
	 *   },
	 *   {
	 *     isReturnNativeResponse: true,
	 *     isTransformResponse: false,
	 *     errorHandling: 'manual'  // 手动处理错误
	 *   }
	 * )
	 * ```
	 */
	function request<T = any>(
		configOrUrl: AxiosRequestConfig | string,
		optionsOrConfig?: RequestOptions | AxiosRequestConfig,
	): Promise<T> {
		// 判断是哪种调用方式
		let axiosConfig: AxiosRequestConfig
		let requestOptions: RequestOptions | undefined

		if (typeof configOrUrl === 'string') {
			// 方式：request(url, config) - 兼容 axios
			axiosConfig = { ...(optionsOrConfig as AxiosRequestConfig | undefined), url: configOrUrl }
			requestOptions = undefined
		} else if (
			optionsOrConfig &&
			('isReturnNativeResponse' in optionsOrConfig ||
				'isTransformResponse' in optionsOrConfig ||
				'errorHandling' in optionsOrConfig)
		) {
			// 方式：request(config, options) - 第二个参数是 RequestOptions
			axiosConfig = configOrUrl
			requestOptions = optionsOrConfig as RequestOptions
		} else {
			// 方式：request(config) 或 request(config, config) - 兼容 axios
			axiosConfig = { ...configOrUrl, ...(optionsOrConfig as AxiosRequestConfig | undefined) }
			requestOptions = undefined
		}

		// 将 RequestOptions 挂载到 config.requestOptions 上，供拦截器使用
		const finalConfig: HttpRequestConfig = {
			...axiosConfig,
			requestOptions,
		}

		return instance.request<T, T>(finalConfig)
	}

	/**
	 * GET 请求
	 * 完全贴合 axios.get 的使用习惯
	 *
	 * @example
	 * ```ts
	 * // axios 标准用法（所有 axios 原生参数都支持）
	 * http.get('/api/user', {
	 *   params: { id: 1 },
	 *   timeout: 5000,
	 *   headers: { 'X-Custom': 'value' }
	 * })
	 *
	 * // 带自定义选项（两个参数）
	 * http.get(
	 *   '/api/user',
	 *   { params: { id: 1 }, timeout: 3000 },  // axios 配置
	 *   {
	 *     isTransformResponse: false,           // 自定义选项
	 *     errorHandling: 'manual'              // 手动处理错误，业务代码自己 catch
	 *   }
	 * ).catch(err => {
	 *   // err 是原始的 AxiosError，可以访问 err.response、err.request 等
	 *   // 业务代码可以自己决定如何处理错误
	 * })
	 * ```
	 */
	request.get = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'get',
			},
			options,
		)
	}

	/**
	 * POST 请求
	 * 完全贴合 axios.post 的使用习惯
	 *
	 * @example
	 * ```ts
	 * // axios 标准用法
	 * http.post('/api/user', { name: 'John' })
	 * http.post('/api/user', { name: 'John' }, {
	 *   headers: { 'X-Custom': 'value' },
	 *   timeout: 5000
	 * })
	 *
	 * // 带自定义选项（三个参数）
	 * http.post(
	 *   '/api/user',
	 *   { name: 'John' },                                    // 请求体
	 *   { timeout: 5000, headers: { 'Content-Type': 'application/json' } }, // axios 配置
	 *   { isReturnNativeResponse: true, errorHandling: 'manual' }            // 自定义选项
	 * )
	 * ```
	 */
	request.post = <T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		options?: RequestOptions,
	): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'post',
				data,
			},
			options,
		)
	}

	/**
	 * PUT 请求
	 */
	request.put = <T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		options?: RequestOptions,
	): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'put',
				data,
			},
			options,
		)
	}

	/**
	 * PATCH 请求
	 */
	request.patch = <T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
		options?: RequestOptions,
	): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'patch',
				data,
			},
			options,
		)
	}

	/**
	 * DELETE 请求
	 */
	request.delete = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'delete',
			},
			options,
		)
	}

	/**
	 * HEAD 请求
	 */
	request.head = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'head',
			},
			options,
		)
	}

	/**
	 * OPTIONS 请求
	 */
	request.options = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
		return request<T>(
			{
				...config,
				url,
				method: 'options',
			},
			options,
		)
	}

	// 暴露底层 axios 实例，方便取消请求、额外拦截器等极端场景
	;(request as any).client = instance

	return request as typeof request & { client: AxiosInstance }
}
