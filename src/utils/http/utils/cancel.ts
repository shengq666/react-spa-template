import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'
import { isFunction } from '@/utils/is'

/**
 * 生成请求的唯一标识（用于请求去重和取消）
 */
export function getPendingUrl(config: AxiosRequestConfig): string {
	const { method, url, data, params } = config
	// 使用 method、url、data、params 生成唯一标识
	const dataStr = data ? JSON.stringify(data) : ''
	const paramsStr = params ? JSON.stringify(params) : ''
	return [method, url, dataStr, paramsStr].join('&')
}

/**
 * 请求取消管理器（参照 kuka-img-pad 和 Ant Design Pro）
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
