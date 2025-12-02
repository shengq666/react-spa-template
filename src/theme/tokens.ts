export type BrandId = 'default' | 'brand1' | 'brand2'

export interface ThemeTokens {
	primaryColor: string
	successColor: string
	warningColor: string
	errorColor: string
	textColor: string
	bgColor: string
	bgColorSecondary: string
}

export const BRAND_THEME_MAP: Record<BrandId, ThemeTokens> = {
	default: {
		primaryColor: '#1677ff',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#ff4d4f',
		textColor: '#333333',
		bgColor: '#ffffff',
		bgColorSecondary: '#f5f5f5',
	},
	brand1: {
		primaryColor: '#00b578',
		successColor: '#00b578',
		warningColor: '#ff8f1f',
		errorColor: '#ff3141',
		textColor: '#222222',
		bgColor: '#ffffff',
		bgColorSecondary: '#f0fdf4',
	},
	brand2: {
		primaryColor: '#ff4d4f',
		successColor: '#52c41a',
		warningColor: '#faad14',
		errorColor: '#d4380d',
		textColor: '#262626',
		bgColor: '#ffffff',
		bgColorSecondary: '#fff1f0',
	},
}

export const BRAND_OPTIONS: { id: BrandId; name: string }[] = [
	{ id: 'default', name: '默认主题' },
	{ id: 'brand1', name: '品牌一' },
	{ id: 'brand2', name: '品牌二' },
]

export function isValidBrandId(value: string | null | undefined): value is BrandId {
	return !!value && (Object.keys(BRAND_THEME_MAP) as BrandId[]).includes(value as BrandId)
}


