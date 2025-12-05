import { Button, Card } from 'antd-mobile'

interface AnalyticsCardProps {
	onReport: () => void
}

export function AnalyticsCard({ onReport }: AnalyticsCardProps) {
	return (
		<Card style={{ marginBottom: 12 }}>
			<div className="home-meta">
				<div style={{ marginBottom: 8 }}>埋点 / 事件示例</div>
				<Button size="small" color="success" onClick={onReport}>
					触发埋点事件
				</Button>
			</div>
		</Card>
	)
}
