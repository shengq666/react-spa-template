import http from '@/utils/http'

export const getHomePageBannerList = (params: any) => {
	return http.request(
		{
			url: '/api/galleryService/bannerInfo/getHomePageBannerList',
			method: 'get',
			params,
		},
		{
			// 页面初始化类请求：推荐使用统一错误处理 + 静默成功，不弹成功 Toast ,这里写了只是告诉你有这么个功能
			isShowSuccessMessage: true,
		},
	)
}
