import { Button, Card, List, Tag, Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSkeleton } from '@/components/Skeleton'
import { ROUTE_PATH } from '@/constants'
import { common, format, validate } from '@/utils'
import http from '@/utils/http'
import './index.scss'

interface ListItem {
	id: number
	title: string
	content: string
	createTime: string
	viewCount: number
}
function getHomePageBannerList(params: any) {
	return http.request({
		url: 'https://qkrelease.kukahome.com/api/galleryService/bannerInfo/getHomePageBannerList',
		method: 'get',
		params,
	})
}
export default function Home() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [list, setList] = useState<ListItem[]>([])
	const [currentTime, setCurrentTime] = useState(new Date())

	const testHttp = async () => {
		const result = await getHomePageBannerList({ displayLocation: 2, configId: 10, guideId: 1155073, type: 3 })
		console.log('======result', result)
	}

	useEffect(() => {
		testHttp()
	}, [])

	// 获取列表数据
	const fetchList = async () => {
		try {
			setLoading(true)
			// 模拟 API 调用
			await common.sleep(1500)
			const mockData: ListItem[] = [
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

	if (loading) {
		return <PageSkeleton rows={5} />
	}

	return (
		<div className="home-page">
			<div className="home-header">
				<h1 className="home-title">首页</h1>
				<div className="home-time">当前时间: {format.datetime(currentTime)}</div>
			</div>

			<div className="home-actions">
				<Button color="primary" size="small" onClick={() => navigate(ROUTE_PATH.USER)}>
					前往用户页
				</Button>
				<Button color="primary" size="small" onClick={() => navigate(ROUTE_PATH.THEME_DEMO)}>
					前往主题配色页
				</Button>
				<Button color="success" size="small" onClick={handleEmailCheck}>
					验证邮箱
				</Button>
				<Button color="warning" size="small" onClick={handleFormatNumber}>
					格式化数字
				</Button>
			</div>

			<List header="文章列表">
				{list.map(item => (
					<List.Item key={item.id}>
						<Card>
							<div className="list-item">
								<div className="list-item-header">
									<h3 className="list-item-title">{item.title}</h3>
									<Tag color="primary">{format.number(item.viewCount)} 浏览</Tag>
								</div>
								<p className="list-item-content">{item.content}</p>
								<div className="list-item-footer">
									<span className="list-item-time">{format.fromNow(item.createTime)}</span>
								</div>
							</div>
						</Card>
					</List.Item>
				))}
			</List>
		</div>
	)
}
