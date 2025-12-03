import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppErrorBoundary } from '@/components/ErrorBoundary'
import { initTheme } from '@/theme/useTheme'
import { initVConsole } from '@/utils/vconsole'
import { router } from './router'
import '@/styles/index.scss'

export function AppRoot() {
	useEffect(() => {
		initVConsole()
		initTheme()
	}, [])

	return (
		<ConfigProvider locale={zhCN}>
			<AppErrorBoundary>
				<div className="app-container">
					<RouterProvider router={router} />
				</div>
			</AppErrorBoundary>
		</ConfigProvider>
	)
}
