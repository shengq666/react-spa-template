import antfu from '@antfu/eslint-config'

export default antfu(
	{
		typescript: true,
		react: true,
		ignores: ['dist', '.vscode', '.lintstagedrc.js', '**/*.md', 'docs/**', '*.md'],
	},
	{
		rules: {
			// 允许使用 tab 缩进（与 Prettier 配置保持一致）
			'style/indent': ['error', 'tab', { SwitchCase: 1, ignoredNodes: [] }],
			'style/no-tabs': 'off',
			'style/jsx-indent-props': ['error', 'tab'],
			'jsonc/indent': ['error', 'tab'],
		},
	}
)
