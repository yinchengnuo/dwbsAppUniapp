import request from '@/common/util/request'

export const _API_GetUserInfo = data => request.get('/user/per_data', data) // 获取用户信息

export const _API_GetUserStatus = data => request.get('/user/getinfo', data) // 获取用户状态


export const _API_SubAuthInfo = data => request.get('/user/submit_user', data) // 提交用户身份认证信息
export const _API_SubAuthOver = data => request.get('/user/user_cert', data) // 用户确认注册审核通过
export const _API_ConfireLevel = data => request.get('/user/confirm_level', data) // 用户确认等级变动通过


export const _API_Auth_Code = data => request.get('/user/auth_code', data) // 获取授权证书信息
export const _API_Auth_Share = data => request.uploadFile('/user/auth_share', data) // 分享授权证书


export const _API_Proxy_Updata = data => request.get('/proxy/updata', data) // 获取代理升级情况
export const _API_Proxy_Upload = data => request.uploadFile('/proxy/upload', data) // 代理升级上传图片
export const _API_Proxy_UploadUrls = data => request.post('/proxy/updata_urls', data) // 代理升级上传图片 urls
