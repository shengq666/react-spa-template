import type { RequestOptions } from '../types'
import { Toast } from 'antd-mobile'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'

/**
 * 显示错误提示
 * 统一的错误消息显示逻辑，用于 HTTP 错误和业务错误
 *
 * @param options 请求选项
 * @param errorMsg 错误消息
 * @param context 上下文信息（用于调试，可选）
 */
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
		// 由于函数开头已经检查了 isShowMessage === false 和 isShowErrorMessage === false
		// 如果为 false 会提前返回，所以这里可以安全地假设它们不是 false
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

	// 根据 errorMessageMode 选择提示方式
	switch (options.errorMessageMode) {
		case 'modal':
			// 使用 Modal 弹窗（antd-mobile 使用 Dialog）
			// 这里暂时使用 Toast，如果需要 Modal 可以后续添加
			Toast.show({
				icon: 'fail',
				content: message,
				duration: 3000,
			})
			break

		case 'none':
			// 不显示提示
			break

		case 'toast':
		default:
			// 默认使用 Toast
			Toast.show({
				icon: 'fail',
				content: message,
			})
			break
	}
}

/**
 * 显示成功提示
 * 统一的成功消息显示逻辑
 *
 * @param options 请求选项
 * @param res 响应数据（可选，用于提取默认消息）
 * @param context 上下文信息（用于调试，可选）
 */
export function showSuccessMessage(options: RequestOptions, res?: any, context?: string): void {
	// 如果全局禁用了消息提示，直接返回
	if (options.isShowMessage === false) {
		return
	}

	// 如果设置了 isShowSuccessMessage: true 或者提供了 successMessageText，则显示成功提示
	if (options.isShowSuccessMessage || options.successMessageText) {
		// 优先级：successMessageText > res.msg > res.message > 默认消息
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

		Toast.show({
			icon: 'success',
			content: message,
		})
	}
}

/**
 * 处理 401 错误（token 过期或无效）
 * 统一的 401 错误处理逻辑，清除本地存储并跳转登录页
 *
 * @note
 * 参照 Ant Design Pro：清除存储后跳转登录
 * 注意：这里使用 window.location.href 而不是路由跳转，因为需要完全刷新页面
 */
export function handle401Error(): void {
	storage.remove(STORAGE_KEYS.TOKEN)
	storage.remove(STORAGE_KEYS.USER_INFO)
	window.location.href = '/#/login'
}
