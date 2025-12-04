import type { RequestOptions } from '../types'
import { Toast } from 'antd-mobile'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'

export interface HttpMessageAdapter {
	showError: (message: string, mode: 'toast' | 'modal' | 'none') => void
	showSuccess: (message: string) => void
}

let messageAdapter: HttpMessageAdapter = {
	showError: (message, mode) => {
		if (mode === 'none') return
		Toast.show({
			content: message,
		})
	},
	showSuccess: message => {
		Toast.show({
			content: message,
		})
	},
}

/** 允许在应用层替换默认的消息适配器（例如切换到 antd message 等） */
export function setHttpMessageAdapter(adapter: Partial<HttpMessageAdapter>): void {
	messageAdapter = {
		...messageAdapter,
		...adapter,
	}
}

/** 统一的错误提示逻辑，用于 HTTP 错误和业务错误 */
export function showErrorMessage(options: RequestOptions, errorMsg: string, context?: string): void {
	// 如果全局禁用了消息提示，直接返回
	if (options.isShowMessage === false) {
		return
	}

	// 如果禁用了错误提示，直接返回
	if (options.isShowErrorMessage === false) {
		return
	}

	const message = options.errorMessageText || errorMsg

	// 调试信息（开发环境）
	if (import.meta.env.DEV) {
		const isMessageEnabled = options.isShowMessage !== (false as boolean)
		const isErrorMessageEnabled = options.isShowErrorMessage !== (false as boolean)
		const willShowToast = isMessageEnabled && isErrorMessageEnabled
		console.warn('[HTTP Error]', {
			context: context || 'unknown',
			message: errorMsg,
			options,
			willShowToast,
		})
	}

	const mode = options.errorMessageMode || 'toast'
	messageAdapter.showError(message, mode)
}

/** 统一的成功提示逻辑 */
export function showSuccessMessage(options: RequestOptions, res?: any, context?: string): void {
	// 如果全局禁用了消息提示，直接返回
	if (options.isShowMessage === false) {
		return
	}

	// 如果设置了 isShowSuccessMessage: true 或者提供了 successMessageText，则显示成功提示
	if (options.isShowSuccessMessage || options.successMessageText) {
		const message = options.successMessageText || res?.msg || res?.message || '操作成功'

		// 调试信息（开发环境）
		if (import.meta.env.DEV) {
			// eslint-disable-next-line no-console
			console.log('[Success Message]', {
				context: context || 'unknown',
				isShowMessage: options.isShowMessage,
				isShowSuccessMessage: options.isShowSuccessMessage,
				successMessageText: options.successMessageText,
				message,
				res,
			})
		}

		messageAdapter.showSuccess(message)
	}
}

/** 统一的 401 处理逻辑：清除本地存储并跳转登录页 */
export function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	window.location.href = '/#/login'
}
