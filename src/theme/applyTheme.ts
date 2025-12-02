import type { ThemeTokens } from './tokens'

export function applyThemeTokens(tokens: ThemeTokens) {
	const root = document.documentElement

	// 自定义 CSS 变量
	root.style.setProperty('--primary-color', tokens.primaryColor)
	root.style.setProperty('--success-color', tokens.successColor)
	root.style.setProperty('--warning-color', tokens.warningColor)
	root.style.setProperty('--error-color', tokens.errorColor)
	root.style.setProperty('--text-color', tokens.textColor)
	root.style.setProperty('--bg-color', tokens.bgColor)
	root.style.setProperty('--bg-color-secondary', tokens.bgColorSecondary)

	// antd-mobile 内置 CSS 变量
	root.style.setProperty('--adm-color-primary', tokens.primaryColor)
	root.style.setProperty('--adm-color-success', tokens.successColor)
	root.style.setProperty('--adm-color-warning', tokens.warningColor)
	root.style.setProperty('--adm-color-danger', tokens.errorColor)
}


