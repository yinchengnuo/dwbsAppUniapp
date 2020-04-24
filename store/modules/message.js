import Vue from 'vue'
import { _API_AppMessage } from '@/apis/app.js'
import { deepClone } from '@/common/util/index.js'

const getPreviewText = item => {
	let status;
	switch (+item.status) {
	    case 0: status = "下单"; break;
	    case 1: status = "发货"; break;
	    case 2: status = "收货"; break;
	}
	return `恭喜您！您有一份价值 ${item.goodList.reduce((t, e) => t + (+e.num * +e.price), 0)} 元的订单已经${status}成功！`
}

export default {
	namespaced: true,
	state: {
		system: [], // 未读消息列表
		myOrder: [], // 未读消息列表
		downOrder: [], // 未读消息列表
		systemLocal: uni.getStorageSync('systemLocal') ? JSON.parse(uni.getStorageSync('systemLocal')) : [], // 从本地存储中读取以缓存的消息
		myOrderLocal: uni.getStorageSync('myOrderLocal') ? JSON.parse(uni.getStorageSync('myOrderLocal')) : [], // 从本地存储中读取以缓存的消息
		downOrderLocal: uni.getStorageSync('downOrderLocal') ? JSON.parse(uni.getStorageSync('downOrderLocal')) : [], // 从本地存储中读取以缓存的消息
	},
	getters: {
		messageNum: state => { // 计算未读消息数量
			return state.system.length + state.myOrder.length + state.downOrder.length
		},
		systemMessageNum: state => { // 计算未读系统消息数量
			return state.system.length
		},
		orderMessageNum: state => { // 计算未读订单消息数量
			return state.myOrder.length + state.downOrder.length
		},
		downOrderMessageNum: state => { // 计算未读下级订单消息数量
			return state.downOrder.length
		},
		previewOrderMessage: state => { // 消息通知页面 订单通知预览文字
			if (state.myOrder.length) { // 如果有未读消息，显示未读消息
				return getPreviewText(state.myOrder[0])
			} else if (state.downOrder.length) { 
				return '恭喜您！您有一份新的下级订单等待确认！'
			} else if (state.myOrderLocal.length) { // 如果没有未读消息，显示本地消息
				return getPreviewText(state.myOrderLocal[0])
			} else if (state.downOrderLocal.length) {
				return '恭喜您！您有一份新的下级订单等待确认！'
			} else {
				return '暂无消息'
			}
		},
		previewSystemMessage: state => { // 消息通知页面 系统通知预览文字
			if (state.system.length) { // 如果有未读消息，显示未读的系统消息
				return `${state.system[0].title} ${state.system[0].message}`
			} else if (state.systemLocal.length) { // 如果没有未读消息，显示本地的系统消息
				return `${state.systemLocal[0].title} ${state.systemLocal[0].message}`
			} else {
				return '暂无消息'
			}
		},
	},
	mutations: {
		readMessage(state, payload) { // 将某条订单消息标记为已读（标记本地消息状态）
			if (payload.type === 2) {
				const item = deepClone(state.myOrderLocal[payload.index])
				item.readed = true
				Vue.set(state.myOrderLocal, payload.index, item)
				uni.setStorageSync('myOrderLocal', JSON.stringify(state.myOrderLocal)) // 缓存消息
			} else if (payload.type === 3) {
				const item = deepClone(state.downOrderLocal[payload.index])
				item.readed = true
				Vue.set(state.downOrderLocal, payload.index, item)
				uni.setStorageSync('downOrderLocal', JSON.stringify(state.downOrderLocal)) // 缓存消息
			}
		},
		setStorage(state, index) { // 批量设置消息已读（清除服务器未读消息队列）
			if (index === 1) {
				state.systemLocal = [...state.system, ...state.systemLocal] // 将未读消息放入已读消息列表
				state.system = [] // 将未读消息清空
				uni.setStorageSync('systemLocal', JSON.stringify(state.systemLocal)) // 缓存消息
				this.commit('message/setTabbarNum') // 设置 tabbar 数字
			} else if (index === 2) {
				state.myOrderLocal = [...state.myOrder, ...state.myOrderLocal] // 将未读消息放入已读消息列表
				state.myOrder = [] // 将未读消息清空
				uni.setStorageSync('myOrderLocal', JSON.stringify(state.myOrderLocal)) // 缓存消息
				this.commit('message/setTabbarNum') // 设置 tabbar 数字
			} else if (index === 3) {
				state.downOrderLocal = [...state.downOrder, ...state.downOrderLocal] // 将未读消息放入已读消息列表
				state.downOrder = [] // 将未读消息清空
				uni.setStorageSync('downOrderLocal', JSON.stringify(state.downOrderLocal)) // 缓存消息
				this.commit('message/setTabbarNum') // 设置 tabbar 数字
			}
		},
		clearStorage(state) { // 清除缓存
			state.systemLocal = []
			state.myOrderLocal = []
			state.downOrderLocal = []
			uni.removeStorageSync('systemLocal')
			uni.removeStorageSync('myOrderLocal')
			uni.removeStorageSync('downOrderLocal')
		},
		setMessage(state, payload) { // 获取未读消息
			state.system = payload[0]
			state.myOrder = payload[1]
			state.downOrder = payload[2]
		},
		setTabbarNum() { // 更新 tabbar 数字
			if (this.getters['message/messageNum']) {
				uni.setTabBarBadge({ index: 3, text: this.getters['message/messageNum'] + '' })
			} else {
				uni.removeTabBarBadge({ index: 3 })
			}
		}
	},
	actions: {
		getMessage ({ commit, getters }) {  //获取 app 消息通知
			_API_AppMessage().then(res => { // 发送获取系统消息网络请求
				if (res.code === 200) {
					commit('setMessage', [res.data.system, res.data.myOrder, res.data.downOrder]) //将获取到的用户微信信息存在 store 里
					uni.vibrateLong() // 震动提醒
					uni.setTabBarBadge({ index: 3, text: String(getters.messageNum) }) // 设置 tabbar 数字提醒
				}
			})
		}
	}
}
