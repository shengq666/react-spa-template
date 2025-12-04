import type { AxiosError } from 'axios'
import type { HttpRequestConfig } from '../types'
import axios from 'axios'
import { codeMessage, ResponseCode } from '../constants'
import { extractCustomOptions, handle401Error, showErrorMessage } from '../utils'

/**
 * 处理错误响应
 * 统一处理错误，自动转换错误信息、处理登录跳转等
 * 注意：CanceledError（请求被取消）是预期行为，应该静默处理，不抛出错误
 *
 * @see https://github.com/axios/axios#cancellation
 * @see https://react.dev/reference/react/StrictMode
 */
export function transformError(error: AxiosError): Promise<never> {
	// 如果是请求被取消（CanceledError），这是预期行为（如 React 严格模式导致的重复请求被取消）
	// 应该静默处理，不抛出错误，不显示错误提示
	// 参照 Ant Design Pro 的做法：CanceledError 不应该作为错误处理
	if (axios.isCancel(error) || error.message === 'canceled' || error.code === 'ERR_CANCELED') {
		// 静默处理：返回一个永远不会 resolve 的 Promise
		// 这样调用方的 catch 不会被触发，也不会显示错误提示
		// 这是预期行为，因为请求被取消是正常的（防止重复请求）
		return new Promise(() => {
			// 静默处理，不做任何操作
			// 这个 Promise 永远不会 resolve 或 reject，调用方会一直等待
			// 但实际上请求已经被取消，所以不会有响应，这是符合预期的
		})
	}

	// 获取请求配置和选项
	const config = error.config as HttpRequestConfig | undefined
	const requestOptions = config?.requestOptions
	const options = extractCustomOptions(requestOptions)

	// 统一处理错误：转换错误信息、处理登录跳转等
	return Promise.reject(convertToBusinessError(error, options))
}

/**
 * 将 AxiosError 转换为业务错误
 * 使用 ResponseCode 枚举和 codeMessage 映射，与 response.ts 保持一致
 */
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
