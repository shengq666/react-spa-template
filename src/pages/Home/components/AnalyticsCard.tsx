import { Button, Card, Toast } from 'antd-mobile'
import { reportEvent } from '@/utils/report'

export function AnalyticsCard() {
	const handleReport = () => {
		reportEvent('home_manual_action', {
			ts: Date.now(),
		})
		Toast.show({
			content: '已触发示例埋点（控制台可见）',
		})
	}

	return (
		<Card style={{ marginBottom: 12 }}>
			<div className="home-meta">
				<div style={{ marginBottom: 8 }}>埋点 / 事件示例</div>
				<Button size="small" color="success" onClick={handleReport}>
					触发埋点事件
				</Button>
			</div>
		</Card>
	)
}
