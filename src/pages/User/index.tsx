import type { UserInfo } from '@/types'
import { Avatar, Badge, Button, Card, List, Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSkeleton } from '@/components/Skeleton'
import { ROUTE_PATH, STORAGE_KEYS } from '@/constants'
import { useUserStore } from '@/store/userStore'
import { common, format, storage, validate } from '@/utils'
import styles from './index.module.scss'

export default function User() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const { user: storeUser, setUser: setStoreUser, clearUser } = useUserStore()
	const [userInfo, setUserInfo] = useState<UserInfo | null>(storeUser)

	// 获取用户信息
	const fetchUserInfo = async () => {
		try {
			setLoading(true)
			// 模拟 API 调用
			await common.sleep(1200)

			// 从 store / 存储中获取或创建模拟数据
			let user: UserInfo | null = storage.get<UserInfo>(STORAGE_KEYS.USER_INFO)
			if (!user) {
				user = {
					id: 1,
					username: 'Demo User',
					email: 'demo@example.com',
					avatar: 'https://via.placeholder.com/80',
					createTime: new Date(Date.now() - 30 * 86400000).toISOString(),
					lastLoginTime: new Date().toISOString(),
					stats: {
						posts: 42,
						followers: 1280,
						following: 365,
					},
				}
				storage.set(STORAGE_KEYS.USER_INFO, user)
			}
			setUserInfo(user)
			setStoreUser(user)
		} catch (error) {
			console.error(error)
			Toast.show({
				icon: 'fail',
				content: '加载用户信息失败',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUserInfo()
		// 依赖只在首次进入页面时触发
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// 验证邮箱
	const handleValidateEmail = () => {
		if (!userInfo) return
		const isValid = validate.email(userInfo.email ?? '')
		Toast.show({
			icon: isValid ? 'success' : 'fail',
			content: `邮箱 ${isValid ? '有效' : '无效'}`,
		})
	}

	// 格式化时间
	const handleFormatTime = () => {
		if (!userInfo) return
		const createTime = format.datetime(userInfo.createTime, 'YYYY年MM月DD日 HH:mm')
		Toast.show({
			content: `注册时间: ${createTime}`,
		})
	}

	// 模拟更新数据
	const handleUpdateStats = () => {
		if (!userInfo) return
		const updated = {
			...userInfo,
			stats: {
				...userInfo.stats,
				posts: userInfo.stats.posts + 1,
			},
		}
		setUserInfo(updated)
		storage.set(STORAGE_KEYS.USER_INFO, updated)
		setStoreUser(updated)
		Toast.show({
			icon: 'success',
			content: '数据已更新',
		})
	}

	// 使用 Zustand 清空用户信息示例
	const handleLogout = () => {
		clearUser()
		setUserInfo(null)
		storage.remove(STORAGE_KEYS.USER_INFO)
		Toast.show({
			icon: 'success',
			content: '已清空用户信息（Zustand Demo）',
		})
	}

	// 返回首页
	const handleGoHome = () => {
		navigate(ROUTE_PATH.HOME)
	}

	if (loading) {
		return <PageSkeleton rows={6} />
	}

	if (!userInfo) {
		return (
			<div className={styles.userPage}>
				<Card>
					<div className={styles.emptyState}>暂无用户信息</div>
				</Card>
			</div>
		)
	}

	return (
		<div className={styles.userPage}>
			<Card className={styles.userHeader}>
				<div className={styles.userAvatarSection}>
					<Badge content={userInfo.stats.posts}>
						<Avatar src={userInfo.avatar ?? 'https://via.placeholder.com/80'} style={{ '--size': '80px' }} />
					</Badge>
				</div>
				<div className={styles.userInfoSection}>
					<h2 className={styles.userName}>{userInfo.username}</h2>
					<p className={styles.userEmail}>{userInfo.email}</p>
					<div className={styles.userTime}>
						<span>注册: {format.fromNow(userInfo.createTime)}</span>
					</div>
				</div>
			</Card>

			<Card className={styles.userStats}>
				<div className={styles.statsItem}>
					<div className={styles.statsValue}>{format.number(userInfo.stats.posts)}</div>
					<div className={styles.statsLabel}>文章</div>
				</div>
				<div className={styles.statsItem}>
					<div className={styles.statsValue}>{format.number(userInfo.stats.followers)}</div>
					<div className={styles.statsLabel}>粉丝</div>
				</div>
				<div className={styles.statsItem}>
					<div className={styles.statsValue}>{format.number(userInfo.stats.following)}</div>
					<div className={styles.statsLabel}>关注</div>
				</div>
			</Card>

			<div className={styles.userActions}>
				<Button color="primary" block onClick={handleValidateEmail}>
					验证邮箱格式
				</Button>
				<Button color="success" block onClick={handleFormatTime}>
					显示注册时间
				</Button>
				<Button color="warning" block onClick={handleUpdateStats}>
					更新数据（演示防抖）
				</Button>
				<Button color="warning" block onClick={handleUpdateStats}>
					更新数据（同步到 Zustand）
				</Button>
				<Button color="danger" block onClick={handleLogout}>
					清空用户信息（Zustand）
				</Button>
				<Button color="primary" block onClick={handleGoHome}>
					返回首页
				</Button>
			</div>

			<Card className={styles.userDetails}>
				<List header="详细信息">
					<List.Item extra={format.datetime(userInfo.createTime)}>注册时间</List.Item>
					<List.Item extra={format.fromNow(userInfo.lastLoginTime)}>最后登录</List.Item>
					<List.Item extra={format.number(userInfo.stats.posts)}>发布文章</List.Item>
					<List.Item extra={format.money(1288.88)}>账户余额</List.Item>
				</List>
			</Card>
		</div>
	)
}
