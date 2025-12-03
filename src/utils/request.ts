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

// 扩展请求配置：支持 per-request 超时 / 额外 headers / 是否返回原始响应等
export interface RequestConfig<T = any> extends AxiosRequestConfig {
	/**
	 * 是否返回原始 AxiosResponse（包含 headers、status 等）
	 * - 默认 false：返回已解包后的业务数据（通常是 res.data）
	 */
	raw?: boolean
	/**
	 * 期望的响应数据类型（仅用于类型提示）
	 */
	responseTypeHint?: T
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
		const config = response.config as RequestConfig

		// 如果调用方显式要求原始响应，则直接返回 AxiosResponse
		if (config.raw) return response

		const res = response.data as BasicResponse | any

		// 如果是符合约定的业务响应结构（包含 code 字段），做统一处理
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

		// 否则视为“非标准业务响应”，直接透传 data
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
 * 1) 统一配置式：
 *    request<BasicResponseModel<ProductItem[]>>({
 *      url: '/api/xxx',
 *      method: 'post',
 *      data: params,
 *    })
 *
 * 2) 语法糖：
 *    request.get<ApiResponse<PaginationResponse<any>>>('/list', { params })
 */
export function request<T = any>(config: RequestConfig<T>): Promise<T> {
	return service.request<T, any>({
		...config,
	})
}

// 语法糖方法，贴合 axios / 业务开发习惯
request.get = <T = any>(url: string, config?: RequestConfig<T>): Promise<T> => {
	return request<T>({
		url,
		method: 'get',
		...(config || {}),
	})
}

request.post = <T = any>(url: string, data?: any, config?: RequestConfig<T>): Promise<T> => {
	return request<T>({
		url,
		method: 'post',
		data,
		...(config || {}),
	})
}

request.put = <T = any>(url: string, data?: any, config?: RequestConfig<T>): Promise<T> => {
	return request<T>({
		url,
		method: 'put',
		data,
		...(config || {}),
	})
}

request.delete = <T = any>(url: string, config?: RequestConfig<T>): Promise<T> => {
	return request<T>({
		url,
		method: 'delete',
		...(config || {}),
	})
}

// 导出 axios 实例，方便极个别场景直接使用（如取消请求、拦截器扩展等）
export default service
