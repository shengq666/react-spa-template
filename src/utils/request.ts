import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '@/constants'
import { storage } from './storage'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = storage.get<string>(STORAGE_KEYS.TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 根据实际后端接口规范调整
    if (res.code !== undefined && res.code !== 200) {
      // token 过期或无效
      if (res.code === 401) {
        storage.remove(STORAGE_KEYS.TOKEN)
        storage.remove(STORAGE_KEYS.USER_INFO)
        // 可以在这里跳转到登录页
        window.location.href = '/#/login'
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error: AxiosError) => {
    console.error('Response error:', error)
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          storage.remove(STORAGE_KEYS.TOKEN)
          storage.remove(STORAGE_KEYS.USER_INFO)
          window.location.href = '/#/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    }
    else if (error.request) {
      message = '网络连接超时'
    }
    return Promise.reject(new Error(message))
  },
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get<T, T>(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post<T, T>(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put<T, T>(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete<T, T>(url, config)
  },
}

export default service

