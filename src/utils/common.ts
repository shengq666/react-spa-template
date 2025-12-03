import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
// 通用工具函数
export const common = {
	// 防抖
	debounce: <T extends (...args: any[]) => any>(func: T, wait = 300) => {
		return debounce(func, wait)
	},

	// 节流
	throttle: <T extends (...args: any[]) => any>(func: T, wait = 300) => {
		return throttle(func, wait)
	},

	// 延迟
	sleep: (ms: number): Promise<void> => {
		return new Promise(resolve => setTimeout(resolve, ms))
	},

	// 深拷贝
	deepClone: <T>(obj: T): T => {
		return JSON.parse(JSON.stringify(obj))
	},

	// 获取 URL 参数
	getUrlParams: (): Record<string, string> => {
		const params: Record<string, string> = {}
		const searchParams = new URLSearchParams(window.location.search)
		searchParams.forEach((value, key) => {
			params[key] = value
		})
		return params
	},

	// 设置 URL 参数
	setUrlParams: (params: Record<string, string | number>): void => {
		const searchParams = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			searchParams.set(key, String(value))
		})
		const newUrl = `${window.location.pathname}?${searchParams.toString()}`
		window.history.pushState({}, '', newUrl)
	},
}
