// 全局类型定义

// 扩展 Window 接口
declare global {
  interface Window {
    // 可以在这里添加全局 window 对象的属性
    // 例如：__APP_CONFIG__?: AppConfig
  }
}

// 全局工具类型
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

// 深度只读类型
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度可选类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 提取 Promise 的返回类型（TypeScript 4.5+ 已内置，这里保留作为兼容）
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

// 函数类型
export type Fn<T = any, R = any> = (...args: T[]) => R
export type AsyncFn<T = any, R = any> = (...args: T[]) => Promise<R>

// 对象值类型
export type ValueOf<T> = T[keyof T]

// 数组元素类型
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never

// 模块声明
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

export {}

