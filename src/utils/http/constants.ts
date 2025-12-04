/**
 * HTTP 响应 code 状态码常量
 * 参照 Ant Design Pro 的实现方式
 */
export enum ResponseCode {
	/** 请求成功 */
	SUCCESS = 200,
	/** 请求失败 */
	ERROR = 500,
	/** Token 过期或无效 */
	TOKEN_EXPIRED = 401,
	/** 无权限 */
	FORBIDDEN = 403,
	/** 未找到 */
	NOT_FOUND = 404,
}

/**
 * code 状态码对应的错误消息映射
 */
export const codeMessage: Record<number, string> = {
	[ResponseCode.SUCCESS]: '请求成功',
	[ResponseCode.ERROR]: '服务器内部错误',
	[ResponseCode.TOKEN_EXPIRED]: '登录身份已失效，请重新登录',
	[ResponseCode.FORBIDDEN]: '拒绝访问',
	[ResponseCode.NOT_FOUND]: '请求地址不存在',
}
