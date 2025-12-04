import type { RequestOptions } from '../types'

/**
 * 自定义参数键名列表
 *
 * 用于区分 axios 原生参数和自定义行为开关。
 * 当添加新的自定义参数时，需要：
 * 1. 在 types.ts 的 RequestOptions 接口中添加字段
 * 2. 在此数组中添加键名
 * 3. 在相应的处理逻辑中使用该参数
 */
const CUSTOM_OPTION_KEYS: (keyof RequestOptions)[] = [
	'isReturnNativeResponse',
	'isTransformResponse',
	// 示例：添加新参数时，取消注释并添加键名
	// 'errorMessageMode',
	// 'withToken',
	// 'retryCount',
]

/**
 * 从 RequestOptions 中提取所有自定义参数
 * @param requestOptions 请求选项
 */
export function extractCustomOptions(requestOptions?: RequestOptions): RequestOptions {
	if (!requestOptions) {
		return getDefaultOptions()
	}

	const options: Partial<RequestOptions> = {}

	// 自动提取所有自定义参数
	for (const key of CUSTOM_OPTION_KEYS) {
		if (key in requestOptions) {
			;(options as any)[key] = requestOptions[key]
		}
	}

	return {
		...getDefaultOptions(),
		...options,
	}
}

/**
 * 获取默认的 RequestOptions
 */
export function getDefaultOptions(): RequestOptions {
	return {
		isReturnNativeResponse: false,
		isTransformResponse: false,
	}
}
