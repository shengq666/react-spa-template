import { Card, List, Tag } from 'antd-mobile'
import { format } from '@/utils'
import styles from './ArticleList.module.scss'

export interface ArticleItem {
	id: number
	title: string
	content: string
	createTime: string
	viewCount: number
}

interface ArticleListProps {
	list: ArticleItem[]
}

export function ArticleList({ list }: ArticleListProps) {
	return (
		<List header="文章列表">
			{list.map(item => (
				<List.Item key={item.id}>
					<Card>
						<div className={styles.listItem}>
							<div className={styles.header}>
								<h3 className={styles.title}>{item.title}</h3>
								<Tag color="primary">{format.number(item.viewCount)} 浏览</Tag>
							</div>
							<p className={styles.content}>{item.content}</p>
							<div className={styles.footer}>
								<span className={styles.time}>{format.fromNow(item.createTime)}</span>
							</div>
						</div>
					</Card>
				</List.Item>
			))}
		</List>
	)
}
