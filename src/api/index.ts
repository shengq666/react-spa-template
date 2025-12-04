import type { ApiResponse, PaginationResponse } from '@/types'
// API 接口导出
// 示例 API（可以根据实际情况调整）
import { http } from '@/utils/http'

// 示例：获取用户信息
export const getUserInfo = (id: string | number) => {
	return http.get<ApiResponse<any>>(`/user/${id}`)
}

// 示例：获取列表
export const getList = (params: { page: number; pageSize: number }) => {
	return http.get<ApiResponse<PaginationResponse<any>>>('/list', { params })
}
