import type { InternalAxiosRequestConfig } from 'axios'
import type { HttpRequestConfig } from '../types'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'
import { extractCustomOptions } from './options'

/**
 * 从存储中获取 token
 */
export function getToken(): string | null {
	return storage.get<string>(STORAGE_KEYS.TOKEN)
}

/**
 * 在请求配置中添加 token
 * @param config axios 请求配置
 */
export function attachToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	const httpConfig = config as HttpRequestConfig
	const requestOptions = httpConfig.requestOptions
	const options = extractCustomOptions(requestOptions)

	// 如果设置了 withToken: false，则不添加 token
	if (options.withToken === false) {
		return config
	}

	const token = getToken()
	if (token && config.headers) {
		// 使用 Mayi-Token（参照 kuka-img-pad）
		config.headers['Mayi-Token'] = token
	}
	return config
}
