import type { AxiosResponse } from 'axios'
import type { BasicResponse, HttpRequestConfig } from '../types'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'
import { codeMessage, ResponseCode } from '../constants'
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
		if (codeValue === ResponseCode.SUCCESS) {
			return res
		}

		// 接口请求错误，统一处理（参照 Ant Design Pro）
		handleBusinessError(codeValue, res)
	}

	// 非标准业务响应，直接透传 data
	return res
}

/**
 * 处理业务错误（参照 Ant Design Pro 的实现方式）
 */
function handleBusinessError(code: number, res: any): never {
	let errorMsg = res.msg || res.message || codeMessage[code] || '请求失败'

	// 根据不同的 code 进行特殊处理
	switch (code) {
		case ResponseCode.TOKEN_EXPIRED:
			// Token 过期或无效，清除本地 token 并跳转登录
			handle401Error()
			errorMsg = codeMessage[ResponseCode.TOKEN_EXPIRED] || errorMsg
			break

		case ResponseCode.FORBIDDEN:
			// 无权限访问
			errorMsg = codeMessage[ResponseCode.FORBIDDEN] || errorMsg
			break

		case ResponseCode.NOT_FOUND:
			// 请求地址不存在
			errorMsg = codeMessage[ResponseCode.NOT_FOUND] || errorMsg
			break

		case ResponseCode.ERROR:
			// 服务器内部错误
			errorMsg = codeMessage[ResponseCode.ERROR] || errorMsg
			break

		default:
			// 其他错误码，使用返回的错误信息
			break
	}

	throw new Error(errorMsg)
}

/**
 * 处理 401 错误（token 过期或无效）
 * 参照 Ant Design Pro：清除本地存储并跳转登录页
 */
function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	// 跳转到登录页（参照 Ant Design Pro：清除存储后跳转登录）
	// 注意：这里使用 window.location.href 而不是路由跳转，因为需要完全刷新页面
	// window.location.href = '/#/login'
}
