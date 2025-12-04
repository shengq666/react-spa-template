import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { HttpRequestConfig, RequestOptions } from './types'
import axios from 'axios'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'
import { transformError } from './transform/error'
import { transformResponse } from './transform/response'
import { AxiosCanceler } from './utils/cancel'
import { extractCustomOptions } from './utils/options'
import { isRequestOptions } from './utils/typeGuard'

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

	// 创建请求取消管理器实例（每个实例独立管理）
	const axiosCanceler = new AxiosCanceler()

	// 注册请求拦截器（使用闭包访问 axiosCanceler）
	instance.interceptors.request.use(config => {
		const httpConfig = config as HttpRequestConfig
		const requestOptions = httpConfig.requestOptions
		const options = extractCustomOptions(requestOptions)

		// 请求取消处理
		const ignoreCancel = options.ignoreCancelToken !== undefined ? options.ignoreCancelToken : false
		if (!ignoreCancel) {
			axiosCanceler.addPending(config)
		}

		return requestInterceptor(config)
	}, requestErrorInterceptor)

	// 注册响应拦截器
	instance.interceptors.response.use(
		response => {
			// 请求成功，移除取消标记
			axiosCanceler.removePending(response.config)
			return transformResponse(response)
		},
		error => {
			// 请求失败，移除取消标记
			if (error.config) {
				axiosCanceler.removePending(error.config)
			}
			return transformError(error)
		},
	)

	/**
	 * 核心请求方法
	 * 完全兼容 axios 的使用习惯，支持所有 axios 原生参数
	 *
	 * 参照 kuka-img-pad 和 Ant Design Pro 的实现方式：
	 * - 当第一个参数是 string 时，第二个参数只能是 AxiosRequestConfig（axios 标准用法）
	 * - 当第一个参数是 AxiosRequestConfig 时，第二个参数可以是 RequestOptions 或 AxiosRequestConfig
	 * - 使用类型守卫函数判断第二个参数类型，避免硬编码字段列表
	 *
	 * @example
	 * ```ts
	 * // 方式1: 单个参数（兼容 axios 标准用法）
	 * // 所有 axios 文档中的参数都可以使用：url, method, params, data, timeout, headers, etc.
	 * http.request({
	 *   url: '/api/user',
	 *   method: 'get',
	 *   params: { id: 1 },
	 *   timeout: 5000,
	 *   headers: { 'X-Custom': 'value' },
	 *   responseType: 'json',
	 *   // ... 其他所有 axios 支持的参数
	 * })
	 *
	 * // 方式2: URL + 配置对象（兼容 axios 标准用法）
	 * // 第二个参数是 AxiosRequestConfig，所有 axios 参数都支持
	 * http.request('/api/user', {
	 *   method: 'get',
	 *   params: { id: 1 },
	 *   timeout: 5000,
	 *   headers: { 'X-Custom': 'value' },
	 *   // ... 其他所有 axios 支持的参数
	 * })
	 *
	 * // 方式3: config + RequestOptions（推荐用法，分离 axios 配置和自定义选项）
	 * // 第一个参数：所有 axios 原生配置（完全兼容 axios 文档）
	 * // 第二个参数：RequestOptions（自定义行为开关）
	 * http.request(
	 *   {
	 *     url: '/api/user',
	 *     method: 'get',
	 *     params: { id: 1 },
	 *     timeout: 5000,  // axios 参数
	 *     headers: { 'X-Custom': 'value' },  // axios 参数
	 *     // ... 其他所有 axios 支持的参数
	 *   },
	 *   {
	 *     skipErrorHandler: true,  // RequestOptions：跳过错误处理
	 *     isShowSuccessMessage: true,  // RequestOptions：显示成功提示
	 *     // ... 其他 RequestOptions 参数
	 *   }
	 * )
	 *
	 * // 方式4: config + config（兼容 axios 标准用法，两个配置会合并）
	 * http.request(
	 *   { url: '/api/user', method: 'get' },
	 *   { params: { id: 1 }, timeout: 5000 }  // 会合并到第一个参数中
	 * )
	 * ```
	 *
	 * @note
	 * - `requestOptions = undefined` 是预期内的，当使用 axios 标准用法时（方式1、2、4），不需要 RequestOptions
	 * - 所有 axios 原生参数都完全支持，可以在第一个参数中使用
	 * - RequestOptions 是自定义的行为开关，用于控制请求的额外行为（如错误处理、成功提示等）
	 * - 使用类型守卫函数 `isRequestOptions` 动态判断第二个参数类型，避免硬编码字段列表
	 */
	function request<T = any>(
		configOrUrl: AxiosRequestConfig | string,
		optionsOrConfig?: RequestOptions | AxiosRequestConfig,
	): Promise<T> {
		// 判断是哪种调用方式
		let axiosConfig: AxiosRequestConfig
		let requestOptions: RequestOptions | undefined

		if (typeof configOrUrl === 'string') {
			// 方式：request(url, config) - 兼容 axios 标准用法
			// 参照 kuka-img-pad：当第一个参数是 string 时，第二个参数只能是 AxiosRequestConfig
			axiosConfig = { ...(optionsOrConfig as AxiosRequestConfig | undefined), url: configOrUrl }
			requestOptions = undefined
		} else if (optionsOrConfig && isRequestOptions(optionsOrConfig)) {
			// 方式：request(config, options) - 第二个参数是 RequestOptions
			// 参照 kuka-img-pad：使用类型守卫函数判断，避免硬编码字段列表
			// 注意：RequestOptions 中不应该包含 axios 配置参数，这些应该在第一个参数中传入
			axiosConfig = configOrUrl
			requestOptions = optionsOrConfig
		} else {
			// 方式：request(config) 或 request(config, config) - 兼容 axios 标准用法
			// 第二个参数是 AxiosRequestConfig，会合并到第一个参数中
			// 这是 axios 的标准用法，完全兼容
			axiosConfig = { ...configOrUrl, ...(optionsOrConfig as AxiosRequestConfig | undefined) }
			requestOptions = undefined
		}

		// 将 RequestOptions 挂载到 config.requestOptions 上，供拦截器使用
		// 参照 kuka-img-pad：使用 @ts-expect-error 或类型断言来处理
		const finalConfig: HttpRequestConfig = {
			...axiosConfig,
			requestOptions,
		}

		return instance.request<T, T>(finalConfig)
	}

	/**
	 * GET 请求
	 * 完全贴合 axios.get 的使用习惯，支持所有 axios 原生参数
	 *
	 * @example
	 * ```ts
	 * // 方式1: axios 标准用法（所有 axios 原生参数都支持）
	 * // 所有 axios 文档中的参数都可以在这里使用：params, timeout, headers, etc.
	 * http.get('/api/user', {
	 *   params: { id: 1 },
	 *   timeout: 5000,
	 *   headers: { 'X-Custom': 'value' },
	 *   responseType: 'json',
	 *   // ... 其他所有 axios 支持的参数
	 * })
	 *
	 * // 方式2: 带自定义选项（三个参数）
	 * // 第一个参数：URL
	 * // 第二个参数：axios 配置（所有 axios 原生参数）
	 * // 第三个参数：RequestOptions（自定义行为开关）
	 * http.get(
	 *   '/api/coupon',
	 *   { params: { id: 1 }, timeout: 5000 },  // axios 配置（所有 axios 参数都支持）
	 *   {
	 *     skipErrorHandler: true,  // RequestOptions：跳过错误处理
	 *     isShowSuccessMessage: true  // RequestOptions：显示成功提示
	 *   }
	 * )
	 *
	 * // 方式3: 统一错误处理（默认），code !== 200 会抛出错误
	 * http.get('/api/user', { params: { id: 1 } })
	 *   .then(result => {
	 *     // 如果 code !== 200，不会执行到这里，会进入 catch
	 *     // result = { code: 200, data: {...}, msg: 'OK' }
	 *   })
	 *   .catch(err => {
	 *     // err 是 Error 对象，包含错误信息
	 *     console.error(err.message)
	 *   })
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
	 * // 支持 FormData（自动处理 Content-Type）
	 * const formData = new FormData()
	 * formData.append('file', file)
	 * formData.append('name', 'John')
	 * http.post('/api/upload', formData) // Content-Type 会自动设置为 multipart/form-data（带 boundary）
	 *
	 * // 带自定义选项（三个参数）
	 * http.post(
	 *   '/api/user',
	 *   { name: 'John' },                                    // 请求体
	 *   { timeout: 5000, headers: { 'Content-Type': 'application/json' } }, // axios 配置
	 *   { isReturnNativeResponse: true }            // 自定义选项
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

	// 将 request 方法挂载到对象上，支持 http.request() 调用方式
	const httpInstance = Object.assign(request, {
		request,
		client: instance,
	})

	return httpInstance as typeof request & { request: typeof request; client: AxiosInstance }
}
