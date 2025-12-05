import type { ArticleItem } from './components'
import type { BrandId } from '@/theme/tokens'
import { Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { PageSkeleton } from '@/components/Skeleton'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { common, format, validate } from '@/utils'
import http from '@/utils/http'
import { reportEvent } from '@/utils/report'
import {
	ActionButtons,
	AnalyticsCard,
	AppStatusCard,
	ArticleList,
	ErrorView,
	HomeHeader,
	UserStatusCard,
} from './components'
import styles from './index.module.scss'

async function getHomePageBannerList(params: any) {
	return http.request(
		{
			url: '/api/galleryService/bannerInfo/getHomePageBannerList',
			method: 'get',
			params,
		},
		{
			// 页面初始化类请求：推荐使用统一错误处理 + 静默成功，不弹成功 Toast ,这里写了只是告诉你有这么个功能
			isShowSuccessMessage: true,
		},
	)
}
export default function Home() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [list, setList] = useState<ArticleItem[]>([])
	const [currentTime, setCurrentTime] = useState(() => new Date())

	// 分别选择字段，避免对象 selector 在 StrictMode 下造成不必要的重复渲染
	const appReady = useAppStore(state => state.appReady)
	const globalLoading = useAppStore(state => state.globalLoading)
	const themeId = useAppStore(state => state.themeId)
	const setThemeId = useAppStore(state => state.setThemeId)

	const user = useUserStore(state => state.user)
	const userLoading = useUserStore(state => state.loading)
	const fetchCurrentUser = useUserStore(state => state.fetchCurrentUser)
	const clearUser = useUserStore(state => state.clearUser)

	// 示例：页面加载时的完整 HTTP 链路（loading + skeleton + error + 埋点）
	const fetchBannerWithDemo = async () => {
		try {
			setLoading(true)
			setError(null)

			const result = await getHomePageBannerList({
				displayLocation: 2,
				configId: 10,
				guideId: 1155073,
				type: 3,
			})

			// 正常情况下 code === 200，直接使用 data
			// 如果后端存在“特殊业务 code”（例如 10086 表示已领取），可以结合 skipErrorHandler 处理：
			// const result = await http.request({ ... }, { skipErrorHandler: true })
			// 在这里根据 result.code 做不同分支处理

			reportEvent('home_banner_loaded', {
				count: Array.isArray(result.data) ? result.data.length : 0,
			})
		} catch (error: any) {
			console.error('fetchBannerWithDemo error:', error)
			setError(error?.message || '数据加载失败，请稍后重试')
		} finally {
			setLoading(false)
		}
	}

	// 保留一个独立的 http 示例（调试用）
	const testHttp = async () => {
		try {
			const result = await getHomePageBannerList({ displayLocation: 2, configId: 10, guideId: 1155073, type: 3 })
			console.warn('======testHttp result', result)
		} catch (error: any) {
			console.error('======testHttp error', error)
		}
	}

	useEffect(() => {
		// 演示：进入页面时的标准请求链路
		fetchBannerWithDemo()
		testHttp()
	}, [])

	// 获取列表数据
	const fetchList = async () => {
		try {
			setLoading(true)
			// 模拟 API 调用
			await common.sleep(1500)
			const mockData: ArticleItem[] = [
				{
					id: 1,
					title: '欢迎使用 React SPA Template',
					content: '这是一个基于 Vite + React + TypeScript 的成熟前端项目模板',
					createTime: new Date().toISOString(),
					viewCount: 1234,
				},
				{
					id: 2,
					title: '项目特性',
					content: '包含路由守卫、错误边界、移动端适配、代码规范等完整功能',
					createTime: new Date(Date.now() - 86400000).toISOString(),
					viewCount: 567,
				},
				{
					id: 3,
					title: '工具库集成',
					content: '已集成 lodash-es、dayjs、classnames 等常用工具库',
					createTime: new Date(Date.now() - 172800000).toISOString(),
					viewCount: 890,
				},
			]
			setList(mockData)
		} catch (error) {
			console.error(error)
			Toast.show({
				icon: 'fail',
				content: '加载失败，请重试',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchList()

		// 更新时间
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	// 验证邮箱示例
	const handleEmailCheck = () => {
		const email = 'test@example.com'
		const isValid = validate.email(email)
		Toast.show({
			icon: isValid ? 'success' : 'fail',
			content: `${email} ${isValid ? '有效' : '无效'}`,
		})
	}

	// 格式化数字示例
	const handleFormatNumber = () => {
		const number = 1234567.89
		const formatted = format.number(number)
		Toast.show({
			content: `格式化: ${number} -> ${formatted}`,
		})
	}

	const handleThemeChange = (newThemeId: BrandId) => {
		setThemeId(newThemeId)
		Toast.show({
			content: `已切换到 ${newThemeId} 主题（示例）`,
		})
	}

	const handleFetchUserInfo = async () => {
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

	const handleReportAction = () => {
		reportEvent('home_manual_action', {
			ts: Date.now(),
		})
		Toast.show({
			content: '已触发示例埋点（控制台可见）',
		})
	}

	if (loading) {
		return <PageSkeleton rows={5} />
	}

	return (
		<div className={styles.homePage}>
			<HomeHeader currentTime={currentTime} />

			{error && <ErrorView error={error} onRetry={fetchBannerWithDemo} />}

			<ActionButtons onEmailCheck={handleEmailCheck} onFormatNumber={handleFormatNumber} />

			<AppStatusCard
				appReady={appReady}
				globalLoading={globalLoading}
				themeId={themeId as BrandId | null}
				onThemeChange={handleThemeChange}
			/>

			<UserStatusCard
				user={user}
				loading={userLoading}
				onFetchUser={handleFetchUserInfo}
				onClearUser={handleClearUser}
			/>

			<AnalyticsCard onReport={handleReportAction} />

			<ArticleList list={list} />
		</div>
	)
}
