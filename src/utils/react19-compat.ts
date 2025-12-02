/**
 * React 19 兼容性配置
 * 解决 antd-mobile 与 React 19 的兼容性问题
 * 
 * 参考：https://mobile.ant.design/guide/v5-for-19
 */
import { unstableSetRender } from 'antd-mobile'
import { createRoot } from 'react-dom/client'
import type { ReactElement } from 'react'

/**
 * 配置 antd-mobile 使用 React 19 的新渲染 API
 * 这解决了 unmountComponentAtNode 不存在的错误
 */
export function setupReact19Compat() {
  // 使用类型断言，因为 antd-mobile 的类型定义可能还未完全适配 React 19
  unstableSetRender(((node: ReactElement, container: Element | DocumentFragment) => {
    const root = createRoot(container)
    root.render(node)
    // 返回清理函数
    return () => {
      root.unmount()
    }
  }) as any)
}
