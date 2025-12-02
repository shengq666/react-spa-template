// 本地存储工具
export const storage = {
  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    catch (error) {
      console.error(`Error getting storage item ${key}:`, error)
      return null
    }
  },

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch (error) {
      console.error(`Error setting storage item ${key}:`, error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    }
    catch (error) {
      console.error(`Error removing storage item ${key}:`, error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    }
    catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}

