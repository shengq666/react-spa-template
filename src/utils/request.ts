import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '@/constants'
import { storage } from './storage'

// 业务通用响应结构（与 src/types 中的 ApiResponse 对应）
export interface BasicResponse<T = any> {
	code: number
	data: T
	message: string
}

/**
 * 单次请求的“行为开关”配置
 * - 与 AxiosRequestConfig 解耦，只描述业务侧如何处理这次请求的响应
 */
export interface RequestOptions {
	/**
	 * 是否返回原始 AxiosResponse（包含 headers、status 等）
	 * - 默认 false：返回已解包后的业务数据（通常是 data 字段）
	 */
	isReturnNativeResponse?: boolean

	/**
	 * 是否按约定格式 (code/data/message) 进行处理
	 * - true：按 BasicResponse 约定解包并做 code 处理（默认）
	 * - false：直接返回 response.data，不做任何包装
	 */
	isTransformResponse?: boolean
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
	},
})

// 请求拦截器
service.interceptors.request.use(
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
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// 从 config 上取出业务行为配置（第二个 RequestOptions 参数会被挂到 requestOptions 上）
		const config: AxiosRequestConfig & { requestOptions?: RequestOptions } = response.config
		const options = config.requestOptions || {}
		const isReturnNativeResponse = options.isReturnNativeResponse === true
		const isTransformResponse = options.isTransformResponse !== false // 默认 true

		// 1. 请求方显式要求原始响应，则直接返回 AxiosResponse
		if (isReturnNativeResponse) return response

		const res = response.data as BasicResponse | any

		// 2. 不进行任何处理，直接返回 data（常用于特殊接口或自定义解析）
		if (!isTransformResponse) return res

		// 3. 标准业务响应：包含 code / data / message 字段
		if (res && typeof res === 'object' && 'code' in res) {
			if (res.code !== 200) {
				// token 过期或无效
				if (res.code === 401) {
					storage.remove(STORAGE_KEYS.TOKEN)
					storage.remove(STORAGE_KEYS.USER_INFO)
					// 可以在这里跳转到登录页
					window.location.href = '/#/login'
				}
				return Promise.reject(new Error(res.message || '请求失败'))
			}

			// 默认只返回 data 字段，避免业务层关心响应头等细节
			return (res as BasicResponse).data
		}

		// 4. 非标准业务响应，直接透传 data
		return res
	},
	(error: AxiosError) => {
		console.error('Response error:', error)
		let message = '请求失败'
		if (error.response) {
			switch (error.response.status) {
				case 400:
					message = '请求参数错误'
					break
				case 401:
					message = '未授权，请重新登录'
					storage.remove(STORAGE_KEYS.TOKEN)
					storage.remove(STORAGE_KEYS.USER_INFO)
					window.location.href = '/#/login'
					break
				case 403:
					message = '拒绝访问'
					break
				case 404:
					message = '请求地址不存在'
					break
				case 500:
					message = '服务器内部错误'
					break
				default:
					message = `连接错误${error.response.status}`
			}
		} else if (error.request) {
			message = '网络连接超时'
		}
		return Promise.reject(new Error(message))
	},
)

/**
 * 核心请求方法
 *
 * 支持两种使用方式：
 * 1) 统一配置式（行为开关放在第二个 RequestOptions 参数中）：
 *    request<BasicResponseModel<ProductItem[]>>(
 *      {
 *      url: '/api/xxx',
 *      method: 'post',
 *      data: params,
 *      timeout: 3000,
 *    },
 *    {
 *      isReturnNativeResponse: false,
 *      isTransformResponse: true,
 *    },
 *    )
 *
 * 2) 语法糖：
 *    request.get<ApiResponse<PaginationResponse<any>>>('/list', { params })
 */
export function request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
	const mergedConfig: AxiosRequestConfig & { requestOptions?: RequestOptions } = {
		...config,
		requestOptions: options,
	}
	return service.request<T, any>(mergedConfig)
}

// 语法糖方法，贴合 axios / 业务开发习惯
request.get = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
	return request<T>(
		{
			...(config || {}),
			url,
			method: 'get',
		},
		options,
	)
}

request.post = <T = any>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig,
	options?: RequestOptions,
): Promise<T> => {
	return request<T>(
		{
			...(config || {}),
			url,
			method: 'post',
			data,
		},
		options,
	)
}

request.put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
	return request<T>(
		{
			...(config || {}),
			url,
			method: 'put',
			data,
		},
		options,
	)
}

request.delete = <T = any>(url: string, config?: AxiosRequestConfig, options?: RequestOptions): Promise<T> => {
	return request<T>(
		{
			...(config || {}),
			url,
			method: 'delete',
		},
		options,
	)
}

// 导出 axios 实例，方便极个别场景直接使用（如取消请求、拦截器扩展等）
export default service
