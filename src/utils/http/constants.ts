/**
 * HTTP 响应 code 状态码常量
 * 参照 Ant Design Pro 的实现方式
 * 同时用于 HTTP 状态码和业务响应 code
 */
export enum ResponseCode {
	/** 请求成功 */
	SUCCESS = 200,
	/** 请求参数错误 */
	BAD_REQUEST = 400,
	/** Token 过期或无效 */
	TOKEN_EXPIRED = 401,
	/** 无权限 */
	FORBIDDEN = 403,
	/** 未找到 */
	NOT_FOUND = 404,
	/** 服务器内部错误 */
	ERROR = 500,
}

/**
 * code 状态码对应的错误消息映射
 * 同时用于 HTTP 状态码和业务响应 code
 */
export const codeMessage: Record<number, string> = {
	[ResponseCode.SUCCESS]: '请求成功',
	[ResponseCode.BAD_REQUEST]: '请求参数错误',
	[ResponseCode.TOKEN_EXPIRED]: '登录身份已失效，请重新登录',
	[ResponseCode.FORBIDDEN]: '拒绝访问',
	[ResponseCode.NOT_FOUND]: '请求地址不存在',
	[ResponseCode.ERROR]: '服务器内部错误',
}
