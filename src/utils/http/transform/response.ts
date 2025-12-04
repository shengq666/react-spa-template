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
				handle401Error()
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
 * 处理 401 错误（token 过期或无效）
 */
function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	// TODO: 可以根据实际情况在这里跳转
	// window.location.href = '/#/login'
}
