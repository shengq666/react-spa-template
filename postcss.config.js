import autoprefixer from 'autoprefixer'
import viewport from 'postcss-mobile-forever'

export default {
  plugins: [
    autoprefixer(),
    viewport({
      viewportWidth: 375, // 设计稿宽度
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i,
      rootContainingBlockSelectorList: ['van-theme-dark', '.van-theme-dark'],
      comment: {
        ignoreLine: 'keep-px', // 指定用于忽略转换的注释关键词
      },
    }),
  ],
}
