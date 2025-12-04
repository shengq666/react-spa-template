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
	 * 是否跳过错误处理（参照 Ant Design Pro 的 skipErrorHandler）
	 * - false（默认）：进行 code 校验，code !== 200 会抛出错误（统一错误处理），成功时返回完整响应体
	 * - true：跳过错误处理，返回完整响应体（包含 code、data、message），让业务代码自己判断 code
	 *   用于业务代码需要根据 code 做不同处理的场景（如：code 10086 表示已领取，需要展示已领取的券）
	 *
	 * @example
	 * ```ts
	 * // 默认行为：进行 code 校验，code !== 200 会抛出错误
	 * const result = await http.get('/api/user')
	 * // 如果 code !== 200，会抛出错误
	 * // 如果 code === 200，返回完整响应体：{ code: 200, data: {...}, msg: 'OK' }
	 *
	 * // 跳过错误处理：返回完整响应体，业务代码自己判断
	 * const result = await http.get('/api/coupon', {}, {
	 *   skipErrorHandler: true
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
	skipErrorHandler?: boolean

	/**
	 * 是否忽略取消 token（不取消重复请求）
	 * - false（默认）：自动取消重复请求
	 * - true：不取消重复请求
	 */
	ignoreCancelToken?: boolean

	/**
	 * 是否显示提示信息
	 * - true（默认）：显示错误/成功提示
	 * - false：不显示提示
	 */
	isShowMessage?: boolean

	/**
	 * 是否显示成功信息
	 * - false（默认）：不显示成功提示
	 * - true：显示成功提示（会使用响应中的 msg/message 或默认消息）
	 *
	 * @example
	 * ```ts
	 * // 启用成功提示
	 * http.post('/api/user', data, {
	 *   isShowSuccessMessage: true
	 * })
	 * ```
	 */
	isShowSuccessMessage?: boolean

	/**
	 * 是否显示失败信息
	 * - true（默认）：显示失败提示
	 * - false：不显示失败提示
	 */
	isShowErrorMessage?: boolean

	/**
	 * 错误消息提示类型
	 * - 'toast'（默认）：使用 Toast 提示
	 * - 'modal'：使用 Modal 弹窗提示
	 * - 'none'：不显示提示
	 */
	errorMessageMode?: 'toast' | 'modal' | 'none'

	/**
	 * 成功的文本信息（自定义成功提示）
	 * 如果设置了此参数，即使 isShowSuccessMessage 为 false，也会显示成功提示
	 *
	 * @example
	 * ```ts
	 * // 自定义成功提示消息
	 * http.post('/api/user', data, {
	 *   successMessageText: '保存成功'
	 * })
	 *
	 * // 同时启用并自定义消息
	 * http.post('/api/user', data, {
	 *   isShowSuccessMessage: true,
	 *   successMessageText: '用户信息已更新'
	 * })
	 * ```
	 */
	successMessageText?: string

	/**
	 * 错误的文本信息（自定义错误提示）
	 */
	errorMessageText?: string

	/**
	 * 是否携带 token
	 * - true（默认）：自动携带 token
	 * - false：不携带 token
	 */
	withToken?: boolean

	/**
	 * 是否添加时间戳（防止 GET 请求缓存）
	 * - true（默认）：GET 请求自动添加 _t 参数
	 * - false：不添加时间戳
	 */
	joinTime?: boolean

	/**
	 * 是否格式化请求参数时间
	 * - true（默认）：自动格式化 Date 对象为字符串
	 * - false：不格式化
	 */
	formatDate?: boolean

	/**
	 * POST 请求时是否将参数拼接到 URL
	 * - false（默认）：参数放在请求体中
	 * - true：参数拼接到 URL
	 */
	joinParamsToUrl?: boolean

	/**
	 * 接口地址（可覆盖默认 baseURL）
	 */
	apiUrl?: string

	/**
	 * 请求拼接路径（URL 前缀）
	 */
	urlPrefix?: string

	/**
	 * 是否加入 URL 前缀
	 * - true（默认）：自动添加 urlPrefix
	 * - false：不添加前缀
	 */
	joinPrefix?: boolean
}

/**
 * 扩展的 AxiosRequestConfig（内部使用）
 * 用于在拦截器中访问 RequestOptions
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
	requestOptions?: RequestOptions
}
