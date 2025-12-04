import antfu from '@antfu/eslint-config'

export default antfu(
	{
		typescript: true,
		react: true,
		ignores: ['dist', '.vscode', '.lintstagedrc.js', '**/*.md', 'docs/**', '*.md', 'pnpm-lock.yaml', 'tsconfig.json'],
	},
	{
		rules: {
			// 统一多行表达式里二元运算符缩进位置的风格
			'style/indent-binary-ops': 'off',
			'style/operator-linebreak': 'off',
			'no-console': 'warn',
			'style/member-delimiter-style': 'off',
			// 箭头函数的参数是否必须用圆括号 () 包裹
			'style/arrow-parens': ['error', 'as-needed'],
			'style/jsx-one-expression-per-line': 'off',
			// 闭合花括号与后续的代码块出现在同一行，关闭
			'style/brace-style': 'off',
			'antfu/top-level-function': 'off',
			'antfu/if-newline': 'off',
			// 禁止出现空代码块，允许 catch 为空代码块
			'no-empty': [
				'error',
				{
					allowEmptyCatch: true,
				},
			],
			// 将未使用的导入从错误改为警告
			'no-unused-vars': 'warn',
			// 允许使用 tab 缩进（与 Prettier 配置保持一致）
			'style/indent': ['error', 'tab', { SwitchCase: 1, ignoredNodes: [] }],
			'style/no-tabs': 'off',
			'style/jsx-indent-props': ['error', 'tab'],
			'jsonc/indent': ['error', 'tab'],
		},
	},
)
