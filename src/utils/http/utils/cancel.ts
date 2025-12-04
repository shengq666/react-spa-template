import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'
import { isFunction, isObject } from '@/utils/is'

/** 对象稳定序列化：按 key 排序，避免 key 顺序导致的不同字符串 */
function stableSerialize(value: unknown): string {
	if (value === undefined || value === null) return ''

	// FormData / File / Blob 等大数据，统一标记，避免庞大字符串
	if (typeof FormData !== 'undefined' && value instanceof FormData) {
		return '[form-data]'
	}

	if (Array.isArray(value)) {
		return `[${value.map(item => stableSerialize(item)).join(',')}]`
	}

	if (isObject(value)) {
		const sortedKeys = Object.keys(value as Record<string, unknown>).sort()
		const entries = sortedKeys.map(key => `${key}:${stableSerialize((value as any)[key])}`)
		return `{${entries.join(',')}}`
	}

	try {
		return JSON.stringify(value)
	} catch {
		return String(value)
	}
}

/** 生成请求的唯一标识（用于请求去重和取消） */
export function getPendingUrl(config: AxiosRequestConfig): string {
	const { method, url, data, params } = config
	const methodStr = (method || 'get').toLowerCase()
	const urlStr = url || ''
	const dataStr = stableSerialize(data)
	const paramsStr = stableSerialize(params)
	return [methodStr, urlStr, dataStr, paramsStr].join('&')
}

/**
 * 请求取消管理器（参照 Ant Design Pro）
 * 每个实例独立管理自己的请求
 */
export class AxiosCanceler {
	// 每个实例有自己独立的 pendingMap
	private pendingMap = new Map<string, Canceler>()

	/**
	 * 添加请求到待取消列表
	 * 如果相同的请求已存在，会先取消旧的请求
	 */
	addPending(config: AxiosRequestConfig): void {
		this.removePending(config)
		const url = getPendingUrl(config)
		config.cancelToken =
			config.cancelToken ||
			new axios.CancelToken(cancel => {
				if (!this.pendingMap.has(url)) {
					// 如果 pending 中不存在当前请求，则添加进去
					this.pendingMap.set(url, cancel)
				}
			})
	}

	/**
	 * 移除请求（请求完成或失败时调用）
	 */
	removePending(config: AxiosRequestConfig): void {
		const url = getPendingUrl(config)
		if (this.pendingMap.has(url)) {
			// 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
			const cancel = this.pendingMap.get(url)
			if (cancel && isFunction(cancel)) {
				cancel(url)
			}
			this.pendingMap.delete(url)
		}
	}

	/**
	 * 清空所有待取消的请求
	 */
	removeAllPending(): void {
		this.pendingMap.forEach(cancel => {
			if (cancel && isFunction(cancel)) {
				cancel()
			}
		})
		this.pendingMap.clear()
	}

	/**
	 * 重置（清空所有请求）
	 */
	reset(): void {
		this.pendingMap.clear()
	}
}
