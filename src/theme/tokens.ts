export type BrandId = 'default' | 'brand1' | 'brand2'

// 用于渲染主题切换按钮的元数据
export const BRAND_OPTIONS: { id: BrandId; name: string }[] = [
	{ id: 'default', name: '默认主题' },
	{ id: 'brand1', name: '品牌一' },
	{ id: 'brand2', name: '品牌二' },
]

export function isValidBrandId(value: string | null | undefined): value is BrandId {
	return !!value && (['default', 'brand1', 'brand2'] as BrandId[]).includes(value as BrandId)
}
