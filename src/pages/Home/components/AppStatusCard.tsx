import { Button, Card, Tag } from 'antd-mobile'
import { useAppStatus } from '../hooks'

export function AppStatusCard() {
	const { appReady, globalLoading, themeId, handleThemeToggle } = useAppStatus()

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
