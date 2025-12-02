import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupReact19Compat } from '@/utils/react19-compat'
import { AppRoot } from './AppRoot'

setupReact19Compat()

const rootElement = document.getElementById('root')

if (!rootElement) {
	throw new Error('Root element not found')
}

createRoot(rootElement).render(
	<StrictMode>
		<AppRoot />
	</StrictMode>
)
