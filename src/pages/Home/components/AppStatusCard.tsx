import type { BrandId } from '@/theme/tokens'
import { Button, Card, Tag } from 'antd-mobile'
import { applyTheme } from '@/theme/applyTheme'
import { BRAND_OPTIONS } from '@/theme/tokens'

interface AppStatusCardProps {
	appReady: boolean
	globalLoading: boolean
	themeId: BrandId | null
	onThemeChange: (themeId: BrandId) => void
}

export function AppStatusCard({ appReady, globalLoading, themeId, onThemeChange }: AppStatusCardProps) {
	const handleThemeToggle = () => {
		const allIds = BRAND_OPTIONS.map(item => item.id)
		const current = themeId || 'brand1'
		const candidates = allIds.filter(id => id !== current)
		const nextTheme = (candidates[Math.floor(Math.random() * candidates.length)] || current) as BrandId

		onThemeChange(nextTheme)
		applyTheme(nextTheme)
	}

	return (
		<Card style={{ marginBottom: 12 }}>
			<div className="home-meta">
				<div>
					<Tag color="primary">App Ready: {appReady ? '是' : '否'}</Tag>
				</div>
				<div style={{ margin: '8px 0' }}>
					<Tag color="warning">Global Loading: {globalLoading ? '是' : '否'}</Tag>
				</div>
				<div style={{ marginBottom: 8 }}>当前主题: {themeId ?? 'default'}</div>
				<Button size="small" onClick={handleThemeToggle}>
					切换主题示例
				</Button>
			</div>
		</Card>
	)
}
