import type { AxiosResponse } from 'axios'
import type { BasicResponse, HttpRequestConfig } from '../types'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'
import { extractCustomOptions } from '../utils/options'

/**
 * 处理成功响应
 */
export function transformResponse<T = any>(response: AxiosResponse<T>): T | AxiosResponse<T> {
	const config = response.config as HttpRequestConfig
	const requestOptions = config.requestOptions
	const options = extractCustomOptions(requestOptions)

	// 1. 如果请求方需要完整的 AxiosResponse（包含响应头、状态码等），直接返回
	if (options.isReturnNativeResponse) {
		return response
	}

	// 默认情况下，只返回响应体（response.data），不包含响应头等信息

	const res = response.data as BasicResponse | any

	// 2. 不进行任何处理，直接返回 data（常用于特殊接口或自定义解析）
	if (!options.isTransformResponse) {
		return res
	}

	// 3. 标准业务响应：包含 code / data / message 字段
	if (res && typeof res === 'object' && 'code' in res) {
		// 处理 code 可能是字符串或数字的情况（如 "200" 或 200）
		const codeValue = typeof res.code === 'string' ? Number(res.code) : res.code

		if (codeValue !== 200) {
			// token 过期或无效
			if (codeValue === 401) {
				handle401Error()
			}
			// 使用 msg 或 message 字段作为错误信息
			const errorMsg = (res as any).msg || (res as any).message || '请求失败'
			throw new Error(errorMsg)
		}

		// 默认返回完整响应体（包含 code、data、msg、ok、timestamp 等），而不是只返回 data
		return res
	}

	// 4. 非标准业务响应，直接透传 data
	return res
}

/**
 * 处理 401 错误（token 过期或无效）
 */
function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	// TODO: 可以根据实际情况在这里跳转
	// window.location.href = '/#/login'
}
