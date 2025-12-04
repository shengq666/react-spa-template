import type { AxiosRequestConfig } from 'axios'

/**
 * 业务通用响应结构
 */
export interface BasicResponse<T = any> {
	code: number
	data: T
	message: string
}

/**
 * 请求选项配置（RequestOptions）
 * 用于控制请求的行为开关，作为第二个参数传入
 *
 * 如何添加新的自定义参数：
 * 1. 在此接口中添加新字段
 * 2. 在 transform.ts 的 CUSTOM_OPTION_KEYS 数组中添加键名
 * 3. 在相应的处理逻辑中使用该参数
 */
export interface RequestOptions {
	/**
	 * 是否返回原始 AxiosResponse（包含 headers、status 等）
	 * - 默认 false：返回已解包后的业务数据（通常是 data 字段）
	 */
	isReturnNativeResponse?: boolean

	/**
	 * 是否按约定格式 (code/data/message) 进行处理
	 * - true（默认）：按 BasicResponse 约定解包并做 code 处理，非 200 会抛出错误，只返回 data 字段
	 * - false：直接返回完整的 response.data（包含 code、message、data），不做任何处理，由业务代码自己判断 code
	 *
	 * @example
	 * ```ts
	 * // 默认行为：code !== 200 会抛出错误
	 * http.get('/api/coupon') // 如果 code !== 200，会抛出错误
	 *
	 * // 关闭转换：返回完整响应体，业务代码自己判断
	 * const result = await http.get('/api/coupon', {}, {
	 *   isTransformResponse: false
	 * })
	 * // result = { code: 10086, msg: '已经领取', data: { list: [...] } }
	 * if (result.code === 10086) {
	 *   // 业务代码根据 code 判断：已领取状态
	 *   showCouponList(result.data.list) // 展示已领取的券
	 * } else if (result.code === 200) {
	 *   // 正常领取成功
	 *   showSuccess()
	 * }
	 * ```
	 */
	isTransformResponse?: boolean

	/**
	 * 错误处理方式
	 * - 'auto'（默认）：统一处理错误，拦截器会自动转换错误信息、处理登录跳转等，抛出 Error 对象
	 * - 'manual'：手动处理错误，拦截器不做任何处理，直接抛出原始 AxiosError，由业务代码自己 catch 处理
	 *
	 * @example
	 * ```ts
	 * // 自动处理（默认）- 统一错误处理
	 * http.get('/api/user').catch(err => {
	 *   // err 是 Error 对象，包含处理后的错误信息
	 *   console.log(err.message) // '请求参数错误'
	 * })
	 *
	 * // 手动处理 - 业务代码自己处理
	 * http.get('/api/user', {}, { errorHandling: 'manual' }).catch(err => {
	 *   // err 是原始的 AxiosError，可以访问完整信息
	 *   if (err.response?.status === 401) {
	 *     // 业务代码自己决定如何处理 401
	 *     customHandle401()
	 *   }
	 * })
	 * ```
	 */
	errorHandling?: 'auto' | 'manual'

	// 未来可以在这里添加更多自定义参数，例如：
	// errorMessageMode?: 'message' | 'none'  // 错误提示方式
	// withToken?: boolean                     // 是否携带 token
	// retryCount?: number                     // 重试次数
}

/**
 * 扩展的 AxiosRequestConfig（内部使用）
 * 用于在拦截器中访问 RequestOptions
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
	requestOptions?: RequestOptions
}
