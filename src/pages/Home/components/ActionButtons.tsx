import { Button, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { format, validate } from '@/utils'
import styles from './ActionButtons.module.scss'

export function ActionButtons() {
	const navigate = useNavigate()

	const handleEmailCheck = () => {
		const email = 'test@example.com'
		const isValid = validate.email(email)
		Toast.show({
			icon: isValid ? 'success' : 'fail',
			content: `${email} ${isValid ? '有效' : '无效'}`,
		})
	}

	const handleFormatNumber = () => {
		const number = 1234567.89
		const formatted = format.number(number)
		Toast.show({
			content: `格式化: ${number} -> ${formatted}`,
		})
	}

	return (
		<div className={styles.actions}>
			<Button color="primary" size="small" onClick={() => navigate('/user')}>
				前往用户页
			</Button>
			<Button color="primary" size="small" onClick={() => navigate('/theme-demo')}>
				前往主题配色页
			</Button>
			<Button color="success" size="small" onClick={handleEmailCheck}>
				验证邮箱
			</Button>
			<Button color="warning" size="small" onClick={handleFormatNumber}>
				格式化数字
			</Button>
		</div>
	)
}
