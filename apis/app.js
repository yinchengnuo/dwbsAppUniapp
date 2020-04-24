import request from '@/common/util/request'

export const _API_DownLoadNewVersion = url => request.downloadFile(url) // 下载新版本

export const _API_IndexIndex = data => request.get('/app/index', data) // 获取 index 首页数据
export const _API_IndexData = data => request.get('/app/data', data) // 获取 index 数据数据

export const _API_AppUpdata = data => request.get('/app/updata', data) // 获取 app 更新链接

export const _API_AppMessage = data => request.get('/app/message', data) // 获取 app 消息通知

export const _API_AppMessage_Read = data => request.get('/app/message_read', data) // 设置 app 消息已读

export const _API_AppFeedback = data => request.get('/app/feedback', data) // 问题反馈