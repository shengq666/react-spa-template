import { Skeleton } from 'antd-mobile'
import classNames from 'classnames'
import styles from './index.module.scss'

interface SkeletonProps {
	className?: string
	rows?: number
	animated?: boolean
}

export function PageSkeleton({ className, rows = 3, animated = true }: SkeletonProps) {
	return (
		<div className={classNames(styles.skeletonWrapper, className)}>
			<Skeleton.Title animated={animated} />
			<Skeleton.Paragraph lineCount={rows} animated={animated} />
			<Skeleton.Title animated={animated} />
			<Skeleton.Paragraph lineCount={rows} animated={animated} />
		</div>
	)
}
