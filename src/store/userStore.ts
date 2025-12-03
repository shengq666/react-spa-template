import type { UserInfo } from '@/types'
import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils/storage'

export interface UserState {
	user: UserInfo | null
	setUser: (user: UserInfo | null) => void
	clearUser: () => void
}

export const useUserStore = create<UserState>(set => ({
	user: storage.get<UserInfo>(STORAGE_KEYS.USER_INFO) ?? null,
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
}))
