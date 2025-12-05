import type { ArticleItem } from './components'
import { Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { PageSkeleton } from '@/components/Skeleton'
import { common } from '@/utils'
import { reportEvent } from '@/utils/report'
import { getHomePageBannerList } from './api'
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

export default function Home() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [list, setList] = useState<ArticleItem[]>([])
	const [currentTime, setCurrentTime] = useState(() => new Date())

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

	if (loading) {
		return <PageSkeleton rows={5} />
	}

	return (
		<div className={styles.homePage}>
			<HomeHeader currentTime={currentTime} />

			{error && <ErrorView error={error} onRetry={fetchBannerWithDemo} />}

			<ActionButtons />

			<AppStatusCard />

			<UserStatusCard />

			<AnalyticsCard />

			<ArticleList list={list} />
		</div>
	)
}
