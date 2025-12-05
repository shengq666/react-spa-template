import type { BrandId } from '@/theme/tokens'
import { Toast } from 'antd-mobile'
import { useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { applyTheme } from '@/theme/applyTheme'
import { BRAND_OPTIONS } from '@/theme/tokens'

/**
 * Home 页面专用的 App 状态管理 Hook
 * 封装了主题切换等业务逻辑
 */
export function useAppStatus() {
	const appReady = useAppStore(state => state.appReady)
	const globalLoading = useAppStore(state => state.globalLoading)
	const themeId = useAppStore(state => state.themeId)
	const setThemeId = useAppStore(state => state.setThemeId)

	const handleThemeChange = useCallback(
		(newThemeId: BrandId) => {
			setThemeId(newThemeId)
			applyTheme(newThemeId)
			Toast.show({
				content: `已切换到 ${newThemeId} 主题（示例）`,
			})
		},
		[setThemeId],
	)

	const handleThemeToggle = useCallback(() => {
		const allIds = BRAND_OPTIONS.map(item => item.id)
		const current = (themeId as BrandId) || 'brand1'
		const candidates = allIds.filter(id => id !== current)
		const nextTheme = (candidates[Math.floor(Math.random() * candidates.length)] || current) as BrandId

		handleThemeChange(nextTheme)
	}, [themeId, handleThemeChange])

	return {
		appReady,
		globalLoading,
		themeId: themeId as BrandId | null,
		handleThemeChange,
		handleThemeToggle,
	}
}
