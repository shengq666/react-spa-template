import type { AxiosResponse } from 'axios'
import type { BasicResponse, HttpRequestConfig } from '../types'
import { codeMessage, ResponseCode } from '../constants'
import { extractCustomOptions, handle401Error, showErrorMessage, showSuccessMessage } from '../utils'

/** 处理成功响应：统一 code 校验与消息提示 */
export function transformResponse<T = any>(response: AxiosResponse<T>): T | AxiosResponse<T> {
	const config = response.config as HttpRequestConfig
	const requestOptions = config.requestOptions
	const options = extractCustomOptions(requestOptions)

	// 1. 如果请求方需要完整的 AxiosResponse（包含响应头、状态码等），直接返回
	if (options.isReturnNativeResponse) {
		return response
	}

	const res = response.data as BasicResponse | any

	if (!res) {
		throw new Error('请求出错，请稍候重试')
	}
	if (res && typeof res === 'object' && 'code' in res) {
		const codeValue = typeof res.code === 'string' ? Number(res.code) : res.code

		if (options.skipErrorHandler) {
			return res
		}

		if (codeValue === ResponseCode.SUCCESS) {
			showSuccessMessage(options, res, 'response')
			return res
		}

		handleBusinessError(codeValue, res, options)
	}

	if (options.isShowSuccessMessage || options.successMessageText) {
		showSuccessMessage(options, res, 'response')
	}

	// 非标准业务响应，直接透传 data
	return res
}

/**
 * 处理业务错误（参照 Ant Design Pro 的实现方式）
 */
function handleBusinessError(code: number, res: any, options: any): never {
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

	// 显示错误提示（使用通用的消息处理函数）
	showErrorMessage(options, errorMsg, 'business-error')

	throw new Error(errorMsg)
}
