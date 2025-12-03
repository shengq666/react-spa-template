import { SpinLoading } from 'antd-mobile'
import classNames from 'classnames'
import './index.scss'

interface LoadingProps {
	className?: string
	size?: 'small' | 'middle' | 'large'
	tip?: string
}

export function Loading({ className, tip }: LoadingProps) {
	return (
		<div className={classNames('loading-wrapper', className)}>
			<SpinLoading style={{ '--size': '48px' }} />
			{tip && <div className="loading-tip">{tip}</div>}
		</div>
	)
}
