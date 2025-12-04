import type { AxiosError } from 'axios'
import type { HttpRequestConfig } from '../types'
import axios from 'axios'
import { codeMessage, ResponseCode } from '../constants'
import { extractCustomOptions, handle401Error, showErrorMessage } from '../utils'

/** 处理错误响应：统一转换为业务错误并做消息提示 */
export function transformError(error: AxiosError): Promise<never> {
	if (axios.isCancel(error) || error.message === 'canceled' || error.code === 'ERR_CANCELED') {
		return new Promise(() => {})
	}

	const config = error.config as HttpRequestConfig | undefined
	const requestOptions = config?.requestOptions
	const options = extractCustomOptions(requestOptions)

	return Promise.reject(convertToBusinessError(error, options))
}

function convertToBusinessError(error: AxiosError, options: any): Error {
	console.error('Response error:', error)
	let message = '请求失败'

	if (error.response) {
		const status = error.response.status
		message = getErrorMessageByStatus(status)

		// 处理 401 错误（使用枚举值，与 response.ts 保持一致）
		if (status === ResponseCode.TOKEN_EXPIRED) {
			handle401Error()
		}

		// 显示错误提示（使用通用的消息处理函数）
		showErrorMessage(options, message, 'http-error')
	} else if (error.request) {
		message = '网络连接超时'
		// 显示错误提示（使用通用的消息处理函数）
		showErrorMessage(options, message, 'network-error')
	}

	return new Error(message)
}

/**
 * 根据 HTTP 状态码获取错误信息
 * 使用 codeMessage 映射，与 response.ts 保持一致
 */
function getErrorMessageByStatus(status: number): string {
	// 优先使用 codeMessage 映射（与 response.ts 保持一致）
	if (codeMessage[status]) {
		return codeMessage[status]
	}

	// 如果没有映射，返回默认错误信息
	return `连接错误${status}`
}
