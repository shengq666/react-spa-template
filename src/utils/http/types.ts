import type { AxiosRequestConfig } from 'axios'

export interface BasicResponse<T = any> {
	code: number | string
	data: T
	msg?: string
	message?: string
	[key: string]: any
}

/** 请求行为配置（作为第二个参数传入，用于控制拦截器行为） */
export interface RequestOptions {
	/**
	 * 是否直接返回 axios 原始响应（包含 headers/status 等），默认只返回 data
	 */
	isReturnNativeResponse?: boolean

	/**
	 * 是否跳过统一错误处理：true 时不根据 code 抛错，由业务自行判断 code
	 */
	skipErrorHandler?: boolean

	/** 是否忽略取消 token（不做重复请求取消） */
	ignoreCancelToken?: boolean

	/** 是否开启消息提示总开关 */
	isShowMessage?: boolean

	/** 是否显示成功提示 */
	isShowSuccessMessage?: boolean

	/** 是否显示错误提示 */
	isShowErrorMessage?: boolean

	/** 错误消息展示方式：toast / modal / none */
	errorMessageMode?: 'toast' | 'modal' | 'none'

	/** 自定义成功提示文案（优先级高于响应里的 msg/message） */
	successMessageText?: string

	/** 自定义错误提示文案（优先级高于默认映射） */
	errorMessageText?: string

	/** 是否自动携带 token */
	withToken?: boolean

	/** 是否为 GET 请求自动添加时间戳参数 */
	joinTime?: boolean

	/** 是否格式化请求参数中的时间字段 */
	formatDate?: boolean

	/** 是否将参数拼接到 URL（而不是放在 body） */
	joinParamsToUrl?: boolean

	/** 覆盖默认 baseURL 的完整接口地址 */
	apiUrl?: string

	/** URL 前缀（如 /api） */
	urlPrefix?: string

	/** 是否在请求 URL 前自动拼接 urlPrefix */
	joinPrefix?: boolean
}

/** 扩展 AxiosRequestConfig，用于在拦截器中访问 RequestOptions */
export interface HttpRequestConfig extends AxiosRequestConfig {
	requestOptions?: RequestOptions
}

/** http 实例类型（createHttp 的返回值） */
export type HttpInstance = ReturnType<typeof import('./core').createHttp>

/** 预设：静默请求（只控制 isShowMessage） */
export type HttpSilentOptions = Pick<RequestOptions, 'isShowMessage'>

/** 预设：带成功提示的请求 */
export type HttpSuccessMessageOptions = Pick<
	RequestOptions,
	'isShowMessage' | 'isShowSuccessMessage' | 'successMessageText'
>

/** 预设：带错误提示的请求 */
export type HttpErrorMessageOptions = Pick<
	RequestOptions,
	'isShowMessage' | 'isShowErrorMessage' | 'errorMessageText' | 'errorMessageMode'
>
