import { create } from 'zustand'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import { applyTheme } from './applyTheme'
import { BRAND_THEME_MAP, type BrandId, type ThemeTokens } from './tokens'

interface ThemeState {
	brandId: BrandId
	tokens: ThemeTokens
	setBrand: (brandId: BrandId) => void
}

const getInitialBrand = (): BrandId => {
	const saved = storage.get<BrandId | null>(STORAGE_KEYS.THEME)
	return saved && saved in BRAND_THEME_MAP ? saved : 'default'
}

const initialBrandId = getInitialBrand()

const useThemeStore = create<ThemeState>(set => ({
	brandId: initialBrandId,
	tokens: BRAND_THEME_MAP[initialBrandId],
	setBrand: brandId => {
		const tokens = BRAND_THEME_MAP[brandId]
		storage.set(STORAGE_KEYS.THEME, brandId)
		set({ brandId, tokens })
		// 通过切换 CSS class 来应用主题（主题变量已在 SCSS 文件中定义）
		applyTheme(brandId)
	},
}))

export function useTheme() {
	return useThemeStore()
}

export function initTheme() {
	const { brandId } = useThemeStore.getState()
	// 初始化时应用主题 class
	applyTheme(brandId)
}
