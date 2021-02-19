import {
	get,
	rePost
} from '../utils/request'

// 根据区划ID获取楼层导览图
export const getPreviews = params => {
	return get('/web/floorPreview/getPreviews', params)
}
// 新增楼层导览图
export const savePreviews = params => {
	return rePost('/web/floorPreview/savePreviews', params)
}
// 获取导览图详情
export const getPreviewsDetail = params => {
	return get('/web/floorPreview/getPreviewsDetail', params)
}
// 删除新闻
export const deletePreviewById = params => {
	return rePost('/web/floorPreview/deletePreviewById', params)
}
