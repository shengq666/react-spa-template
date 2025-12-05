import { SpinLoading } from 'antd-mobile'
import classNames from 'classnames'
import styles from './index.module.scss'

interface LoadingProps {
	className?: string
	size?: 'small' | 'middle' | 'large'
	tip?: string
}

export function Loading({ className, tip }: LoadingProps) {
	return (
		<div className={classNames(styles.loadingWrapper, className)}>
			<SpinLoading style={{ '--size': '48px' }} />
			{tip && <div className={styles.loadingTip}>{tip}</div>}
		</div>
	)
}
