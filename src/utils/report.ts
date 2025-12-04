/**
 * 应用级监控 & 埋点预留模块
 *
 * 当前实现仅使用 console 进行输出，方便本地开发调试。
 * 实际项目中可在此处接入：
 * - Sentry / Aliyun ARMS / 自研埋点 SDK
 * - 或者使用 logHttp / navigator.sendBeacon 上报到后端
 */

export interface ReportContext {
	tags?: Record<string, string>
	extra?: Record<string, any>
}

/** 错误上报（运行时错误、接口异常等） */
export function reportError(error: unknown, context?: ReportContext): void {
	// 这里是预留扩展点：实际项目中可替换为 Sentry.captureException 等

	console.error('[reportError]', {
		error,
		context,
	})
}

/** 事件/行为上报（PV、按钮点击、接口耗时等） */
export function reportEvent(eventName: string, payload?: Record<string, any>): void {
	// 这里是预留扩展点：实际项目中可替换为埋点 SDK 上报
	// eslint-disable-next-line no-console
	console.log('[reportEvent]', {
		eventName,
		payload,
	})
}
