import antfu from '@antfu/eslint-config'

export default antfu({
	typescript: true,
	react: true,
	ignores: ['dist', '.vscode', '.lintstagedrc.js', '**/*.md', 'docs/**', '*.md'],
})
