import type { InternalAxiosRequestConfig } from 'axios'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '../../storage'

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
	const token = getToken()
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}
