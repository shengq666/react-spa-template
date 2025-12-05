import { Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/constants'
import styles from './ActionButtons.module.scss'

interface ActionButtonsProps {
	onEmailCheck: () => void
	onFormatNumber: () => void
}

export function ActionButtons({ onEmailCheck, onFormatNumber }: ActionButtonsProps) {
	const navigate = useNavigate()

	return (
		<div className={styles.actions}>
			<Button color="primary" size="small" onClick={() => navigate(ROUTE_PATH.USER)}>
				前往用户页
			</Button>
			<Button color="primary" size="small" onClick={() => navigate(ROUTE_PATH.THEME_DEMO)}>
				前往主题配色页
			</Button>
			<Button color="success" size="small" onClick={onEmailCheck}>
				验证邮箱
			</Button>
			<Button color="warning" size="small" onClick={onFormatNumber}>
				格式化数字
			</Button>
		</div>
	)
}
