import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions } from '../types'

/** RequestOptions 的字段列表，用于区分自定义行为开关与 axios 原生配置 */
export const CUSTOM_OPTION_KEYS: (keyof RequestOptions)[] = [
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

/** 常见的 AxiosRequestConfig 字段列表，用于类型守卫 */
export const AXIOS_CONFIG_KEYS: (keyof AxiosRequestConfig)[] = [
	'url',
	'method',
	'baseURL',
	'transformRequest',
	'transformResponse',
	'headers',
	'params',
	'paramsSerializer',
	'data',
	'timeout',
	'withCredentials',
	'adapter',
	'auth',
	'responseType',
	'responseEncoding',
	'xsrfCookieName',
	'xsrfHeaderName',
	'onUploadProgress',
	'onDownloadProgress',
	'maxContentLength',
	'maxBodyLength',
	'validateStatus',
	'maxRedirects',
	'socketPath',
	'httpAgent',
	'httpsAgent',
	'proxy',
	'cancelToken',
	'signal',
	'decompress',
	'transitional',
	'env',
]

/** 从 RequestOptions 中提取所有自定义参数，并合并默认值 */
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

/** 默认的 RequestOptions 配置 */
export function getDefaultOptions(): RequestOptions {
	return {
		isReturnNativeResponse: false,
		skipErrorHandler: false, // 默认进行 code 校验，统一错误处理
		ignoreCancelToken: false, // 默认取消重复请求
		// 参照业界/Ant Design Pro 习惯：
		// 默认不在 HTTP 层弹出成功/失败提示，而是由业务层按需开启
		// 这样进入页面时的一堆初始化请求不会干扰用户体验
		isShowMessage: true, // 默认不显示提示信息，需要时在单个请求上显式开启
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
