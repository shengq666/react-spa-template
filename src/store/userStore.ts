import { create } from 'zustand'
import type { UserInfo } from '@/types'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

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
