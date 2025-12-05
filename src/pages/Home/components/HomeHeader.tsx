import { format } from '@/utils'
import styles from './HomeHeader.module.scss'

interface HomeHeaderProps {
	currentTime: Date
}

export function HomeHeader({ currentTime }: HomeHeaderProps) {
	return (
		<div className={styles.header}>
			<h1 className={styles.title}>首页</h1>
			<div className={styles.time}>当前时间: {format.datetime(currentTime)}</div>
		</div>
	)
}
