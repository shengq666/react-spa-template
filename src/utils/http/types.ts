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
	 * 是否返回完整的 AxiosResponse（包含响应头、状态码、响应体等所有数据）
	 * - false（默认）：只返回响应体（response.data），不包含响应头、状态码等信息
	 * - true：返回完整的 AxiosResponse 对象，包含：
	 *   - headers: 响应头
	 *   - status: HTTP 状态码
	 *   - statusText: HTTP 状态文本
	 *   - data: 响应体
	 *   - config: 请求配置
	 *   - request: 请求对象
	 *
	 * @example
	 * ```ts
	 * // 默认：只返回响应体
	 * const data = await http.get('/api/user')
	 * // data = { code: 200, data: {...}, msg: 'OK' }
	 *
	 * // 返回完整响应（包含响应头等）
	 * const response = await http.request(
	 *   { url: '/api/user', method: 'get' },
	 *   { isReturnNativeResponse: true }
	 * )
	 * // response = {
	 * //   data: { code: 200, data: {...}, msg: 'OK' },
	 * //   headers: { 'content-type': 'application/json', ... },
	 * //   status: 200,
	 * //   statusText: 'OK',
	 * //   config: {...},
	 * //   request: {...}
	 * // }
	 * // 可以访问响应头：response.headers['content-type']
	 * ```
	 */
	isReturnNativeResponse?: boolean

	/**
	 * 是否按约定格式 (code/data/message) 进行处理
	 * - false（默认）：不进行任何处理，直接返回 response.data（包含 code、message、data），用于页面代码可能需要直接获取 code，data，message 这些信息时使用
	 * - true：按 BasicResponse 约定做 code 校验，code !== 200 会抛出错误，成功时返回业务 data
	 *
	 * @example
	 * ```ts
	 * // 默认行为：返回完整响应体，业务代码自己判断
	 * const result = await http.get('/api/coupon', {}, {
	 *   // 不传或传 false：返回 { code, data, message }
	 * })
	 * // result = { code: 10086, msg: '已经领取', data: { list: [...] } }
	 * if (result.code === 10086) {
	 *   // 业务代码根据 code 判断：已领取状态
	 *   showCouponList(result.data.list) // 展示已领取的券
	 * } else if (result.code === 200) {
	 *   // 正常领取成功
	 *   showSuccess()
	 * }
	 *
	 * // 开启转换：按约定格式处理，code !== 200 会抛出错误
	 * const data = await http.get('/api/coupon', {}, { isTransformResponse: true })
	 * // data = 实际业务数据（不再包含 code、message）
	 * ```
	 */
	isTransformResponse?: boolean

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
