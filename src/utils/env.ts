// 设备 / 环境检测相关工具方法

// 是否在浏览器环境（避免 SSR 或测试环境下直接访问 window 报错）
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined'

const UA = isBrowser ? navigator.userAgent.toLowerCase() : ''

export const env = {
	// 环境相关
	isDev: () => import.meta.env.DEV,
	isProd: () => import.meta.env.PROD,
	getEnv: () => import.meta.env.VITE_ENV || (import.meta.env.DEV ? 'development' : 'production'),

	// 设备 / 平台判断
	isIOS: () => /iphone|ipad|ipod/.test(UA),
	isAndroid: () => /android/.test(UA),
	isMobile: () => /iphone|ipad|ipod|android|mobile/.test(UA),

	// 是否在微信内置浏览器
	isWeChat: () => /micromessenger/.test(UA),

	// 是否可能在小程序 WebView 中（简单 UA 识别，具体小程序环境可在业务中再细化）
	isMiniProgramWebView: () => /miniprogram/.test(UA) || /miniProgramEnv/.test(UA),

	// 是否在 PC 浏览器
	isPC: () => isBrowser && !/iphone|ipad|ipod|android|mobile/.test(UA),

	// 当前窗口宽高（仅在浏览器环境有效）
	getWindowSize: () => {
		if (!isBrowser) return { width: 0, height: 0 }
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	},
}
