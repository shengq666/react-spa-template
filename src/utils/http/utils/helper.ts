import dayjs from 'dayjs'
import { isObject, isString } from '@/utils/is'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 添加时间戳到请求参数（防止缓存）
 * @param join 是否添加时间戳
 * @param restful 是否为 RESTful 风格（返回字符串）
 */
export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object
export function joinTimestamp(join: boolean, restful = false): string | object {
	if (!join) {
		return restful ? '' : {}
	}
	const now = new Date().getTime()
	if (restful) {
		return `?_t=${now}`
	}
	return { _t: now }
}

/**
 * 格式化请求参数中的时间
 * 将 Date 对象或 dayjs 对象格式化为字符串
 */
export function formatRequestDate(params: Record<string, any>): void {
	if (!isObject(params)) {
		return
	}

	for (const key in params) {
		const value = params[key]
		if (!value) {
			continue
		}

		// 处理 Date 对象
		if (value instanceof Date) {
			params[key] = dayjs(value).format(DATE_TIME_FORMAT)
		}
		// 处理 dayjs 对象（如果有 _isAMomentObject 属性）
		else if (value._isAMomentObject || (isObject(value) && 'format' in value && isFunction(value.format))) {
			params[key] = dayjs(value).format(DATE_TIME_FORMAT)
		}
		// 处理字符串，去除首尾空格
		else if (isString(value)) {
			params[key] = value.trim()
		}
		// 递归处理嵌套对象
		else if (isObject(value)) {
			formatRequestDate(value)
		}
	}
}

/**
 * 判断是否为 URL
 */
export function isUrl(url: string): boolean {
	return /^https?:\/\//.test(url)
}

/**
 * 将对象转换为 URL 参数字符串
 */
export function setObjToUrlParams(baseUrl: string, obj: Record<string, any>): string {
	let parameters = ''
	for (const key in obj) {
		parameters += `${key}=${encodeURIComponent(obj[key])}&`
	}
	parameters = parameters.replace(/&$/, '')
	return /\?$/.test(baseUrl) ? `${baseUrl}${parameters}` : `${baseUrl}?${parameters}`
}

function isFunction(val: unknown): boolean {
	return typeof val === 'function'
}
