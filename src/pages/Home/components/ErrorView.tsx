import { Button, Result } from 'antd-mobile'

interface ErrorViewProps {
	error: string
	onRetry: () => void
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
	return (
		<div style={{ marginBottom: 16 }}>
			<Result status="error" title="数据加载失败" description={error} />
			<div style={{ marginTop: 12, textAlign: 'center' }}>
				<Button color="primary" size="small" onClick={onRetry}>
					重新加载
				</Button>
			</div>
		</div>
	)
}
