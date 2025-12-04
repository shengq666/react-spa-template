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
	'skipErrorHandler',
	'ignoreCancelToken',
	'isShowMessage',
	'isShowSuccessMessage',
	'isShowErrorMessage',
	'errorMessageMode',
	'successMessageText',
	'errorMessageText',
	'withToken',
	'joinTime',
	'formatDate',
	'joinParamsToUrl',
	'apiUrl',
	'urlPrefix',
	'joinPrefix',
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
		skipErrorHandler: false, // 默认进行 code 校验，统一错误处理
		ignoreCancelToken: false, // 默认取消重复请求
		isShowMessage: true, // 默认显示提示信息
		isShowSuccessMessage: false, // 默认不显示成功提示
		isShowErrorMessage: true, // 默认显示失败提示
		errorMessageMode: 'toast', // 默认使用 Toast 提示
		withToken: true, // 默认携带 token
		joinTime: true, // 默认添加时间戳
		formatDate: true, // 默认格式化时间
		joinParamsToUrl: false, // 默认不拼接参数到 URL
		joinPrefix: true, // 默认添加 URL 前缀
	}
}
