import type { AxiosError, AxiosResponse } from 'axios'
import type { BasicResponse, HttpRequestConfig, RequestOptions } from './types'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../storage'

/**
 * 自定义参数键名列表
 *
 * 用于区分 axios 原生参数和自定义行为开关。
 * 当添加新的自定义参数时，需要：
 * 1. 在 types.ts 的 RequestOptions 接口中添加字段
 * 2. 在此数组中添加键名
 * 3. 在相应的处理逻辑中使用该参数
 */
const CUSTOM_OPTION_KEYS: (keyof RequestOptions)[] = [
	'isReturnNativeResponse',
	'isTransformResponse',
	'errorHandling',
	// 示例：添加新参数时，取消注释并添加键名
	// 'errorMessageMode',
	// 'withToken',
	// 'retryCount',
]

/**
 * 从 config 中提取所有自定义行为开关配置
 *
 * 处理流程：
 * 1. 从 config.requestOptions 中提取所有在 CUSTOM_OPTION_KEYS 中定义的字段
 * 2. 设置默认值
 * 3. 返回合并后的配置对象
 */
export function getBehaviorOptions(config: HttpRequestConfig): RequestOptions {
	const requestOptions = config.requestOptions || {}
	const options: RequestOptions = {}

	// 自动提取所有自定义参数
	for (const key of CUSTOM_OPTION_KEYS) {
		if (key in requestOptions) {
			;(options as any)[key] = requestOptions[key]
		}
	}

	// 设置默认值并合并
	return {
		isReturnNativeResponse: options.isReturnNativeResponse === true,
		isTransformResponse: options.isTransformResponse !== false, // 默认 true
		errorHandling: options.errorHandling || 'auto', // 默认自动处理
		...options,
	}
}

/**
 * 处理成功响应
 */
export function transformResponse<T = any>(response: AxiosResponse<T>): T | AxiosResponse<T> {
	const config = response.config as HttpRequestConfig
	const options = getBehaviorOptions(config)

	// 1. 请求方显式要求原始响应，则直接返回 AxiosResponse
	if (options.isReturnNativeResponse) {
		return response
	}

	const res = response.data as BasicResponse | any

	// 2. 不进行任何处理，直接返回 data（常用于特殊接口或自定义解析）
	if (!options.isTransformResponse) {
		return res
	}

	// 3. 标准业务响应：包含 code / data / message 字段
	if (res && typeof res === 'object' && 'code' in res) {
		if (res.code !== 200) {
			// token 过期或无效
			if (res.code === 401) {
				storage.remove(STORAGE_KEYS.TOKEN)
				storage.remove(STORAGE_KEYS.USER_INFO)
				// TODO: 可以根据实际情况在这里跳转
				// window.location.href = '/#/login'
			}
			throw new Error(res.message || '请求失败')
		}

		// 默认只返回 data 字段，避免业务层关心响应头等细节
		return (res as BasicResponse).data
	}

	// 4. 非标准业务响应，直接透传 data
	return res
}

/**
 * 处理错误响应
 *
 * 根据 errorHandling 参数决定错误处理方式：
 * - 'auto'（默认）：统一处理错误，自动显示错误信息、处理登录跳转等
 * - 'manual'：不进行任何处理，直接抛出原始 AxiosError，由业务代码自己 catch 处理
 *
 * @example
 * ```ts
 * // 自动处理（默认）
 * http.get('/api/user').catch(err => {
 *   // err 是 Error 对象，包含处理后的错误信息
 * })
 *
 * // 手动处理
 * http.get('/api/user', {}, { errorHandling: 'manual' }).catch(err => {
 *   // err 是原始的 AxiosError，可以访问 err.response、err.request 等
 *   // 业务代码可以自己决定如何处理错误
 * })
 * ```
 */
export function transformError(error: AxiosError): Promise<never> {
	const config = error.config as HttpRequestConfig | undefined
	const options = config ? getBehaviorOptions(config) : { errorHandling: 'auto' }

	// 如果设置为手动处理，直接抛出原始错误，不做任何统一处理
	// 业务代码可以自己 catch 并决定如何处理（如显示自定义错误提示、特殊跳转等）
	if (options.errorHandling === 'manual') {
		return Promise.reject(error)
	}

	// 自动处理错误（默认行为）
	// 统一处理错误：转换错误信息、处理登录跳转等
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

	// 返回处理后的错误信息（Error 对象）
	return Promise.reject(new Error(message))
}
