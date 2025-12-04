import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils/storage'

export interface AppState {
	/** 应用是否已完成初始化（例如配置/用户信息拉取） */
	appReady: boolean
	/** 全局 loading（例如路由切换或全局请求时可用） */
	globalLoading: boolean
	/** 当前主题 id（示例：与主题模块联动） */
	themeId: string | null
	setGlobalLoading: (loading: boolean) => void
	setThemeId: (themeId: string | null) => void
	/** 模拟异步初始化（可在这里做配置拉取、用户信息恢复等） */
	initApp: () => Promise<void>
}

export const useAppStore = create<AppState>(set => ({
	appReady: false,
	globalLoading: false,
	themeId: storage.get<string>(STORAGE_KEYS.THEME) ?? 'default',
	setGlobalLoading: globalLoading => set({ globalLoading }),
	setThemeId: themeId => {
		if (themeId) {
			storage.set(STORAGE_KEYS.THEME, themeId)
		} else {
			storage.remove(STORAGE_KEYS.THEME)
		}
		set({ themeId })
	},
	initApp: async () => {
		// 这里可以放置真实的初始化逻辑：
		// 例如：拉取远程配置、检测登录状态、预加载部分字典等
		try {
			set({ globalLoading: true })
			// 模拟异步初始化
			await new Promise(resolve => setTimeout(resolve, 300))
		} finally {
			set({ globalLoading: false, appReady: true })
		}
	},
}))
