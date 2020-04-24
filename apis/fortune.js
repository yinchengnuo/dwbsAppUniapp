import request from '@/common/util/request'

export const _API_FortuneChart = data => request.get('/app/chart?type=2', data) // 获取 财富管理 图表数据接口

export const _API_FortuneIncomeList = data => request.get('/income/income', data) // 获取 收入流水 接口

export const _API_FortuneRecordOrder = data => request.get('/inventory/record', data) // 零售录单 接口

export const _API_FortuneRecordRecord = data => request.get('/inventory/record_his', data) // 零售录单历史记录 接口

export const _API_FortuneReward = data => request.get('/income/detail', data) // 奖励收入/支出详情 接口
