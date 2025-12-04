import type { InternalAxiosRequestConfig } from 'axios'

/**
 * 检查数据是否为 FormData
 */
export function isFormData(data: any): data is FormData {
	return data instanceof FormData
}

/**
 * 处理 FormData 请求的 Content-Type
 * FormData 需要浏览器自动设置 boundary，所以删除手动设置的 Content-Type
 * @param config axios 请求配置
 */
export function handleFormDataContentType(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	if (isFormData(config.data) && config.headers) {
		// 删除 Content-Type，让浏览器自动设置（包含 boundary）
		delete config.headers['Content-Type']
		delete config.headers['content-type']
	}
	return config
}
