import type { AxiosError } from 'axios'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'

/**
 * 处理错误响应
 * 统一处理错误，自动转换错误信息、处理登录跳转等
 */
export function transformError(error: AxiosError): Promise<never> {
	// 统一处理错误：转换错误信息、处理登录跳转等
	return Promise.reject(convertToBusinessError(error))
}

/**
 * 将 AxiosError 转换为业务错误
 */
function convertToBusinessError(error: AxiosError): Error {
	console.error('Response error:', error)
	let message = '请求失败'

	if (error.response) {
		const status = error.response.status
		message = getErrorMessageByStatus(status)

		// 处理 401 错误
		if (status === 401) {
			handle401Error()
		}
	} else if (error.request) {
		message = '网络连接超时'
	}

	return new Error(message)
}

/**
 * 根据 HTTP 状态码获取错误信息
 */
function getErrorMessageByStatus(status: number): string {
	const statusMessages: Record<number, string> = {
		400: '请求参数错误',
		401: '未授权，请重新登录',
		403: '拒绝访问',
		404: '请求地址不存在',
		500: '服务器内部错误',
	}

	return statusMessages[status] || `连接错误${status}`
}

/**
 * 处理 401 错误（token 过期或无效）
 */
function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	window.location.href = '/#/login'
}
