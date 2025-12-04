import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: '.',
	publicDir: 'public',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@/components': resolve(__dirname, 'src/components'),
			'@/pages': resolve(__dirname, 'src/pages'),
			'@/utils': resolve(__dirname, 'src/utils'),
			'@/api': resolve(__dirname, 'src/api'),
			'@/styles': resolve(__dirname, 'src/styles'),
			'@/types': resolve(__dirname, 'src/types'),
			'@/constants': resolve(__dirname, 'src/constants'),
			'@/assets': resolve(__dirname, 'src/assets'),
		},
	},
	server: {
		port: 3000,
		open: true,
		proxy: {
			'/api': {
				target: 'https://qkrelease.kukahome.com',
				changeOrigin: true,
			},
		},
	},
	preview: {
		port: 4173,
		open: true,
		// 由于构建后的HTML在dist/entry/index.html,需要指定正确的入口
		// 注意:preview模式下,Vite会自动处理路径,但需要确保base配置正确
		// open: '/entry/index.html', //指定预览入口文件
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		assetsDir: 'assets',
		sourcemap: false,
		rollupOptions: {
			// 当前 SPA 模式：使用对象形式，让 HTML 输出到 dist/index.html
			// 未来 MPA 扩展：可以添加更多入口，如 { index: 'entry/index.html', member: 'entry/member.html' }
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router', 'react-router-dom'],
					'antd-mobile': ['antd-mobile'],
					'utils-vendor': ['axios', 'dayjs', 'lodash-es', 'classnames'],
				},
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // 使用现代 API，避免 legacy JS API 警告
				additionalData: `@use "@/styles/variables.scss" as *;`,
			},
		},
	},
})
