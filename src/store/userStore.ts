import type { UserInfo } from '@/types'
import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils/storage'

export interface UserState {
	user: UserInfo | null
	loading: boolean
	setUser: (user: UserInfo | null) => void
	clearUser: () => void
	/** 模拟异步获取当前用户信息（示例：可替换为真实接口） */
	fetchCurrentUser: () => Promise<void>
}

export const useUserStore = create<UserState>(set => ({
	user: storage.get<UserInfo>(STORAGE_KEYS.USER_INFO) ?? null,
	loading: false,
	setUser: user => {
		if (user) {
			storage.set(STORAGE_KEYS.USER_INFO, user)
		} else {
			storage.remove(STORAGE_KEYS.USER_INFO)
		}
		set({ user })
	},
	clearUser: () => {
		storage.remove(STORAGE_KEYS.USER_INFO)
		set({ user: null })
	},
	async fetchCurrentUser() {
		// 这里只是示例：实际项目中可替换为 http 请求
		try {
			set({ loading: true })
			// 模拟异步请求
			await new Promise(resolve => setTimeout(resolve, 300))
			const cached = storage.get<UserInfo>(STORAGE_KEYS.USER_INFO)
			if (cached) {
				set({ user: cached })
			}
		} finally {
			set({ loading: false })
		}
	},
}))
