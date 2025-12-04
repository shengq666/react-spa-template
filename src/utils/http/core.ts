import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { HttpRequestConfig, RequestOptions } from './types'
import axios from 'axios'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'
import { transformError } from './transform/error'
import { transformResponse } from './transform/response'
import { AxiosCanceler } from './utils/cancel'
import { extractCustomOptions } from './utils/options'
import { isRequestOptions } from './utils/typeGuard'

/** 创建带请求/响应拦截器的 HTTP 实例，可用于多实例场景 */
export function createHttp(baseConfig?: AxiosRequestConfig) {
	const instance: AxiosInstance = axios.create(baseConfig)
	const axiosCanceler = new AxiosCanceler()

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

	/** 核心请求方法：兼容 axios 调用方式，额外支持第二个参数传入 RequestOptions */
	function request<T = any>(
		configOrUrl: AxiosRequestConfig | string,
		optionsOrConfig?: RequestOptions | AxiosRequestConfig,
	): Promise<T> {
		// 判断是哪种调用方式
		let axiosConfig: AxiosRequestConfig
		let requestOptions: RequestOptions | undefined

		if (typeof configOrUrl === 'string') {
			axiosConfig = { ...(optionsOrConfig as AxiosRequestConfig | undefined), url: configOrUrl }
			requestOptions = undefined
		} else if (optionsOrConfig && isRequestOptions(optionsOrConfig)) {
			axiosConfig = configOrUrl
			requestOptions = optionsOrConfig
		} else {
			axiosConfig = { ...configOrUrl, ...(optionsOrConfig as AxiosRequestConfig | undefined) }
			requestOptions = undefined
		}

		const finalConfig: HttpRequestConfig = {
			...axiosConfig,
			requestOptions,
		}

		return instance.request<T, T>(finalConfig)
	}

	/** GET 请求：与 axios.get 一致，额外支持第三个参数传 RequestOptions */
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

	/** POST 请求：与 axios.post 一致，额外支持第四个参数传 RequestOptions */
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

	/** PUT 请求 */
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

	/** PATCH 请求 */
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

	/** DELETE 请求 */
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

	/** HEAD 请求 */
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

	/** OPTIONS 请求 */
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
	;(request as any).client = instance

	const httpInstance = Object.assign(request, {
		request,
		client: instance,
	})

	return httpInstance as typeof request & { request: typeof request; client: AxiosInstance }
}
