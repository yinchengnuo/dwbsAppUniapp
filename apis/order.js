import request from '@/common/util/request'

export const _API_OrderChart = data => request.get('/app/chart?type=0', data) // 获取 订单管理 图表数据接口


export const _API_OrderMyExamine = data => request.get('/order/my_order?status=0', data) // 我的订单-待审核
export const _API_OrderMySended = data => request.get('/order/my_order?status=1', data) // 我的订单-已发货
export const _API_OrderMyCompleted = data => request.get('/order/my_order?status=2', data) // 我的订单-已完成


export const _API_OrderDownWillpay = data => request.get('/order/order_lower?status=0', data) // 下级订单-待付款
export const _API_OrderDownWillsend = data => request.get('/order/order_lower?status=1', data) // 下级订单-待发货
export const _API_OrderDownSended = data => request.get('/order/order_lower?status=2', data) // 下级订单-已发货
export const _API_OrderDownForward = data => request.get('/order/order_turn', data) // 下级订单-已转发
export const _API_OrderDownCompleted = data => request.get('/order/order_lower?status=3', data) // 下级订单-已完成


export const _API_PlaceOrder = data => request.post('/order/submit_order', data) // 订货下单


export const _API_OrderReceiveGoods = data => request.get('/order/order_complete', data) // 确认收货


export const _API_OrderReceiveMoney = data => request.get('/order/order_sure_pay', data) // 确认收款


export const _API_OrderDel = data => request.get('/order/del', data) // 删除订单


export const _API_OrderDetail = data => request.get('/order/detail', data) // 获取订单详情


export const _API_OrderSend = data => request.post('/order/forward', data) // 发货/转单


export const _API_OrderStorage = data => request.get('/order/my_storage', data) // 我的库存