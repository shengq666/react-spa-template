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

	if (!res) {
		throw new Error('请求出错，请稍候重试')
	}

	// 默认返回完整响应体（包含 code、data、message）
	// 标准业务响应：包含 code / data / message 字段
	if (res && typeof res === 'object' && 'code' in res) {
		// 处理 code 可能是字符串或数字的情况（如 "200" 或 200）
		const codeValue = typeof res.code === 'string' ? Number(res.code) : res.code

		// skipErrorHandler: true - 跳过错误处理，返回完整响应体，让业务代码自己判断 code
		// 用于业务代码需要根据 code 做不同处理的场景（如：code 10086 表示已领取，需要展示已领取的券）
		if (options.skipErrorHandler) {
			return res
		}

		// skipErrorHandler: false（默认）- 进行 code 校验，code !== 200 会抛出错误（统一错误处理）
		// 请求成功
		if (codeValue === 200) {
			return res
		}

		// 401 特殊处理：token 过期或无效，需要清除本地 token
		if (codeValue === 401) {
			handle401Error()
		}

		// 接口请求错误，统一提示错误信息
		const errorMsg = (res as any).msg || (res as any).message || '请求失败'
		throw new Error(errorMsg)
	}

	// 非标准业务响应，直接透传 data
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
