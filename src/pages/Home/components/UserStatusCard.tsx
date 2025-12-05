import { Button, Card, Toast } from 'antd-mobile'
import { useUserStore } from '@/store/userStore'

export function UserStatusCard() {
	const user = useUserStore(state => state.user)
	const loading = useUserStore(state => state.loading)
	const fetchCurrentUser = useUserStore(state => state.fetchCurrentUser)
	const clearUser = useUserStore(state => state.clearUser)

	const handleFetchUser = async () => {
		await fetchCurrentUser()
		const latestUser = useUserStore.getState().user
		Toast.show({
			content: latestUser ? '已同步用户信息' : '未找到缓存的用户信息',
		})
	}

	const handleClearUser = () => {
		clearUser()
		Toast.show({
			content: '已清空用户信息',
		})
	}

	return (
		<Card style={{ marginBottom: 12 }}>
			<div className="home-meta">
				<div style={{ marginBottom: 4 }}>用户状态：{user ? user.username || user.email || '已登录' : '未登录'}</div>
				<div style={{ marginBottom: 8 }}>Store Loading：{loading ? '是' : '否'}</div>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					<Button size="small" onClick={handleFetchUser}>
						同步用户信息
					</Button>
					<Button size="small" color="warning" onClick={handleClearUser}>
						清空用户信息
					</Button>
				</div>
			</div>
		</Card>
	)
}
