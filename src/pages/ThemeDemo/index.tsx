import type { BrandId } from '@/theme/tokens'
import { Button, Card, Tag } from 'antd-mobile'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BRAND_QUERY_KEY } from '@/constants'
import { BRAND_OPTIONS, isValidBrandId } from '@/theme/tokens'
import { useTheme } from '@/theme/useTheme'
import styles from './index.module.scss'

export default function ThemeDemo() {
	const [searchParams, setSearchParams] = useSearchParams()
	const { brandId, setBrand } = useTheme()

	// 根据 URL 中的 brandId 初始化主题
	useEffect(() => {
		const brandFromUrl = searchParams.get(BRAND_QUERY_KEY)
		if (isValidBrandId(brandFromUrl) && brandFromUrl !== brandId) {
			setBrand(brandFromUrl)
		}
		// 只在首次进入时根据 URL 初始化
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeBrand = (id: BrandId) => {
		setBrand(id)
		// 同步到 URL，方便分享或从小程序传入
		searchParams.set(BRAND_QUERY_KEY, id)
		setSearchParams(searchParams)
	}

	return (
		<div className={styles.themeDemoPage}>
			<h1 className={styles.themeDemoTitle}>多主题演示</h1>
			<p className={styles.themeDemoDesc}>
				当前品牌 ID：<Tag color="primary">{brandId}</Tag>
			</p>

			<Card title="切换品牌主题" className={styles.themeDemoCard}>
				<div className={styles.themeDemoButtons}>
					{BRAND_OPTIONS.map(option => (
						<Button
							key={option.id}
							color={option.id === brandId ? 'primary' : 'default'}
							size="small"
							onClick={() => handleChangeBrand(option.id)}
						>
							{option.name}
						</Button>
					))}
				</div>
			</Card>

			<Card title="主题效果预览" className={styles.themeDemoCard}>
				<div className={styles.themeDemoPreview}>
					<Button color="primary" block>
						主按钮（primaryColor）
					</Button>
					<Button color="success" block>
						成功按钮（successColor）
					</Button>
					<Button color="warning" block>
						警告按钮（warningColor）
					</Button>
					<Button color="danger" block>
						错误按钮（errorColor）
					</Button>
				</div>
			</Card>
		</div>
	)
}
