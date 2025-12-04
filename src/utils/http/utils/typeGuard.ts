import type { RequestOptions } from '../types'
import { AXIOS_CONFIG_KEYS, CUSTOM_OPTION_KEYS } from './options'

/**
 * 判断对象是否是 RequestOptions
 * 使用类型守卫函数，动态检查 CUSTOM_OPTION_KEYS
 *
 * 参照 kuka-img-pad 和 Ant Design Pro 的实现方式：
 * - 优先检查是否包含 RequestOptions 特有的字段
 * - 如果包含 RequestOptions 字段且不包含 axios 配置字段，则认为是 RequestOptions
 * - 如果同时包含两者，比较字段数量，RequestOptions 字段更多或相等则认为是 RequestOptions
 *
 * @param obj 待判断的对象
 * @returns 是否是 RequestOptions
 *
 * @example
 * ```ts
 * // 这些会被识别为 RequestOptions
 * isRequestOptions({ skipErrorHandler: true })  // true
 * isRequestOptions({ isShowSuccessMessage: true, skipErrorHandler: true })  // true
 *
 * // 这些会被识别为 AxiosRequestConfig
 * isRequestOptions({ params: {}, timeout: 5000 })  // false
 * isRequestOptions({ url: '/api', method: 'get' })  // false
 *
 * // 混合情况：如果 RequestOptions 字段更多或相等，则认为是 RequestOptions
 * isRequestOptions({ skipErrorHandler: true, timeout: 5000 })  // true（RequestOptions 字段更多）
 * isRequestOptions({ params: {}, timeout: 5000, headers: {}, skipErrorHandler: true })  // false（axios 字段更多）
 * ```
 */
export function isRequestOptions(obj: any): obj is RequestOptions {
	if (!obj || typeof obj !== 'object') {
		return false
	}

	// 如果包含 axios 配置的常见字段，更可能是 AxiosRequestConfig
	// 但也要检查是否包含 RequestOptions 的字段
	const hasAxiosKeys = AXIOS_CONFIG_KEYS.some(key => key in obj)
	const hasRequestOptionKeys = CUSTOM_OPTION_KEYS.some(key => key in obj)

	// 如果包含 RequestOptions 的字段，且不包含 axios 配置字段，则认为是 RequestOptions
	if (hasRequestOptionKeys && !hasAxiosKeys) {
		return true
	}

	// 如果同时包含两者，比较字段数量来判断
	if (hasRequestOptionKeys && hasAxiosKeys) {
		// 检查 RequestOptions 特有的字段数量
		const requestOptionKeyCount = CUSTOM_OPTION_KEYS.filter(key => key in obj).length
		const axiosKeyCount = AXIOS_CONFIG_KEYS.filter(key => key in obj).length

		// 如果 RequestOptions 字段更多或相等，则认为是 RequestOptions（优先考虑 RequestOptions）
		// 这样可以确保即使用户在 RequestOptions 中混入了一些 axios 参数，也能正确识别
		// 参照 kuka-img-pad：RequestOptions 更特殊，应该优先识别
		return requestOptionKeyCount >= axiosKeyCount
	}

	return false
}
