import { Button, Card } from 'antd-mobile'

interface User {
	username?: string
	email?: string
	[key: string]: any
}

interface UserStatusCardProps {
	user: User | null
	loading: boolean
	onFetchUser: () => void
	onClearUser: () => void
}

export function UserStatusCard({ user, loading, onFetchUser, onClearUser }: UserStatusCardProps) {
	return (
		<Card style={{ marginBottom: 12 }}>
			<div className="home-meta">
				<div style={{ marginBottom: 4 }}>用户状态：{user ? user.username || user.email || '已登录' : '未登录'}</div>
				<div style={{ marginBottom: 8 }}>Store Loading：{loading ? '是' : '否'}</div>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					<Button size="small" onClick={onFetchUser}>
						同步用户信息
					</Button>
					<Button size="small" color="warning" onClick={onClearUser}>
						清空用户信息
					</Button>
				</div>
			</div>
		</Card>
	)
}
