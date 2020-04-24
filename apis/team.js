import request from '@/common/util/request'

export const _API_TeamChart = data => request.get('/app/chart?type=1', data) // 获取 订单管理 图表数据接口

export const _API_TeamPerData = data => request.get('/team/card_data', data) // 获取 个人名片数据


export const _API_TeamList_Direct = data => request.get('/team/list?type=0', data) // 获取 => 团队管理 => 直属代理列表
export const _API_TeamList_Down = data => request.get('/team/list?type=1', data) // 获取 => 团队管理 => 下级代理列表


export const _API_TeamAchievement = data => request.get('/team/money', data) // 获取团队成员业绩


export const _API_TeamInviteActive = data => request.get('/team/invite?type=0', data) // 获取 => 我的邀请 => 已激活
export const _API_TeamInviteNoActive = data => request.get('/team/invite?type=1', data) // 获取 => 我的邀请 => 未激活


export const _API_ExamineList_Invite = data => request.get('/team/examine_list?type=0', data) // 获取 => 注册审核 => 我的邀请
export const _API_ExamineList_Down = data => request.get('/team/examine_list?type=1', data) // 获取 => 注册审核 => 我的下级


export const _API_Examine = data => request.get('/team/examine', data) // 审核 通过/驳回


export const _API_InviteCode = data => request.get('/team/invite_code', data) // 获取邀请码



