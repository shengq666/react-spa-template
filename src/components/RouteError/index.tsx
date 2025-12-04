import { Button, Result } from 'antd-mobile'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

export function RouteErrorFallback() {
	const navigate = useNavigate()
	const error = useRouteError()

	let description = '页面出现未知错误，请稍后重试'

	if (isRouteErrorResponse(error)) {
		description = `${error.status} ${error.statusText || ''}`.trim()
	} else if (error instanceof Error) {
		description = error.message
	}

	return (
		<div style={{ padding: '24px' }}>
			<Result status="error" title="页面加载失败" description={description} />
			<div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
				<Button size="small" onClick={() => navigate('/', { replace: true })}>
					返回首页
				</Button>
				<Button size="small" color="warning" onClick={() => window.location.reload()}>
					刷新页面
				</Button>
			</div>
		</div>
	)
}
