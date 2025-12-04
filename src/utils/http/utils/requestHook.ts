import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions } from '../types'
import { isString } from '@/utils/is'
import { formatRequestDate, isUrl, joinTimestamp, setObjToUrlParams } from './helper'

/**
 * 请求前的钩子处理（参照 kuka-img-pad）
 * 处理 URL 前缀、参数格式化、时间戳等
 */
export function beforeRequestHook(config: AxiosRequestConfig, options: RequestOptions): AxiosRequestConfig {
	const { apiUrl, joinPrefix, urlPrefix, joinParamsToUrl, formatDate, joinTime = true } = options

	const urlStr = config.url as string
	const isUrlStr = isUrl(urlStr)

	// 1. 处理 URL 前缀
	if (!isUrlStr && joinPrefix && urlPrefix) {
		config.url = `${urlPrefix}${config.url}`
	}

	// 2. 处理 apiUrl（可覆盖默认 baseURL）
	if (!isUrlStr && apiUrl && isString(apiUrl)) {
		config.url = `${apiUrl}${config.url}`
	}

	const params = config.params || {}
	const data = config.data || false

	// 3. GET 请求处理
	if (config.method?.toUpperCase() === 'GET') {
		if (!isString(params)) {
			// 给 GET 请求加上时间戳参数，避免从缓存中拿数据
			config.params = Object.assign({}, params || {}, joinTimestamp(joinTime, false))
		} else {
			// 兼容 RESTful 风格
			config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
			config.params = undefined
		}
	}
	// 4. 非 GET 请求处理
	else {
		if (!isString(params)) {
			// 格式化日期参数
			if (formatDate) {
				formatRequestDate(params)
			}

			if (
				Reflect.has(config, 'data') &&
				config.data &&
				(Object.keys(config.data as object).length > 0 || config.data instanceof FormData)
			) {
				// 如果提供了 data，则合并 commonParams 到 data
				config.data = { ...data }
				config.params = params
			} else {
				// 非 GET 请求如果没有提供 data，则将 params 视为 data
				config.data = { ...params }
				config.params = undefined
			}

			// 将参数拼接到 URL
			if (joinParamsToUrl) {
				config.url = setObjToUrlParams(config.url as string, { ...config.params, ...config.data })
			}
		} else {
			// 兼容 RESTful 风格
			config.url = config.url + params
			config.params = undefined
		}
	}

	return config
}
