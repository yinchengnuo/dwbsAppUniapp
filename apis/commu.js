import request from '@/common/util/request'

export function commuRecommend(data) { // 社区推荐
	return request.get('/article/show_list?type=0', data)
}

export function commuNewest(data) { // 社区最新
	return request.get('/article/show_list?type=1', data)
}

export function commuChanglai(data) { // 社区常来
	return request.get('/article/show_list?type=2', data)
}

export function commuCollect(data) { // 社区收藏
	return request.get('/article/mycollection', data)
}

export function commuLike(data) { // 社区点赞收藏
	return request.get('/article/like', data)
}

