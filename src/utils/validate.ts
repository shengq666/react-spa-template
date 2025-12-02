// 验证工具函数
export const validate = {
  // 邮箱验证
  email: (email: string): boolean => {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return reg.test(email)
  },

  // 手机号验证（中国）
  phone: (phone: string): boolean => {
    const reg = /^1[3-9]\d{9}$/
    return reg.test(phone)
  },

  // 身份证验证（中国）
  idCard: (idCard: string): boolean => {
    const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
    return reg.test(idCard)
  },

  // URL 验证
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    }
    catch {
      return false
    }
  },

  // 必填验证
  required: (value: any): boolean => {
    if (value === null || value === undefined)
      return false
    if (typeof value === 'string')
      return value.trim().length > 0
    if (Array.isArray(value))
      return value.length > 0
    return true
  },

  // 最小长度验证
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  // 最大长度验证
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },
}

