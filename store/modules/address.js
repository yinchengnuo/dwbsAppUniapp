export default {
	namespaced: true,
	state: {
		usingIndex: -1, // 用户手动选择的地址下标
		list: [] // 地址列表
	},
	getters: {
		usingAddressIndex: (state) => { // 用户订单地址Index
			return state.usingIndex
		}
	},
	mutations: {
		GET_ADDRESS(state, list) { // 请求地址
			state.list = list
			console.log(state.list)
		},
		CHOOSEADDRESS(state, index) { // 用户下单手动选择地址
			state.usingIndex = index
		},
		CLEARCHOOSED(state) { // 下单完成清除已选的地址
			state.usingIndex = -1
		},
		DEL(state, index) { // 删除地址
			state.list.splice(index, 1)
		}
	}
}
