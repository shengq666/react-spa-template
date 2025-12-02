import type { BrandId } from './tokens'

/**
 * 通过切换 CSS class 来应用主题
 * 所有主题变量已在 SCSS 文件中定义（styles/theme/*.scss）
 */
export function applyTheme(brandId: BrandId) {
	const root = document.documentElement
	const body = document.body

	// 移除所有主题 class
	const themeClasses = ['theme-default', 'theme-brand1', 'theme-brand2']
	themeClasses.forEach(className => {
		root.classList.remove(className)
		body.classList.remove(className)
	})

	// 添加当前主题 class
	const themeClass = `theme-${brandId}`
	root.classList.add(themeClass)
	body.classList.add(themeClass)
}
