import request from '@/common/util/request'

export const _API_GoodList = data => request.get('/goods/list', data) // 获取商品列别接口

export const _API_GoodDetail = data => request.get('/goods/detail', data) // 获取商品详情接口