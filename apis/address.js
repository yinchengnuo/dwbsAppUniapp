import request from '@/common/util/request'

// 地址
export const _API_AddressAdd = data => request.post('/user/add_address', data) // 增

export const _API_AddressDel = data => request.get('/user/del_address', data) // 删

export const _API_AddressUpdata = data => request.post('/user/update_address', data) // 改

export const _API_AddressGet = data => request.get('/user/show_address', data) // 查