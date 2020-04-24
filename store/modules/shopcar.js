import { deepClone, clearTypeListZeros, clearGoodTypeListZero, mergeGoodToShopcar, clearShoplistConfirmed } from '@/common/util/index.js'

export default {
	namespaced: true,
	state: {
		list: []
	},
	getters: {
		shopcarNum: state => { // 计算购车商品数量
			return state.list.reduce((t, e) => {
				return e.typeList.reduce((tt, ee) => {
					return Object.keys(ee.size).reduce((ttt, eee) => {
						return ttt + ee.size[eee]
					}, tt)
				}, t)
			}, 0)
		},
		choosedNum: state => { // 计算购车已选商品数量
			return state.list.reduce((t, e) => {
				return e.typeList.reduce((tt, ee) => {
					return Object.keys(ee.size).reduce((ttt, eee) => {
						return ttt + (ee.choosed[eee] ? ee.size[eee] : 0)
					}, tt)
				}, t)
			}, 0)
		},
		choosedPrice: state => { // 计算购车已选商品价值
			return state.list.reduce((t, e) => {
				return e.typeList.reduce((tt, ee) => {
					return Object.keys(ee.size).reduce((ttt, eee) => {
						return ttt + (ee.choosed[eee] ? ee.size[eee] : 0) * e.price
					}, tt)
				}, t)
			}, 0)
		},
		choosedList: state => { // 获取购物车已选中的商品列表
			const list = deepClone(state.list)
			for(let i = list.length - 1; i >= 0; i --) {
				if (!list[i].choosed) {
					list.splice(i, 1)
				} else {
					list[i].typeList.forEach(ee => {
						Object.keys(ee.choosed).forEach(eee => {
							if (!ee.choosed[eee]) {
								delete ee.size[eee]
								delete ee.choosed[eee]
							}
						})
					})
				}
			}
			return list
		},
		choosedAll: state => { // 计算购车是否为全选状态
			return state.list.every(e => {
				return e.typeList.every(ee => {
					return Object.keys(ee.choosed).every(eee => {
						return ee.choosed[eee]
					})
				})
			})
		}
	},
	mutations: {
		ADD(state, payload) { // 添加商品到购物车 (已存在合并,不存在添加)
			const index = state.list.findIndex(e => e.id === payload.id) // 检查添加商品是否存在于购物车中
			setTimeout(() => {
				if(state.list.length === 0 || index === -1) {
					state.list.push(payload)
				} else {
					mergeGoodToShopcar(state.list[index], payload)
				}
			}, 567)
		},
		DEL(state, index) { // 删除这件商品
			state.list.splice(index, 1)
		},
		CLEARCONFIRM(state, payload) { // 提交订单后删除购物车已经提交的商品
			clearShoplistConfirmed(state.list, payload)
		},
		COUNTCHANGE(state, payload) { // 修改购物商品数量相关操作
			const index = payload[0], typeIndex = payload[1], key = payload[2], value = payload[3]
			state.list[index].typeList[typeIndex].size[key] = value
			if (value === 0) { // 当某个尺码数量变为 0 时,进行一波操作,删除这件商品的这个类型或者商品
				clearTypeListZeros(state.list[index].typeList) // 清除这件商品 typeList 中 对象的 size 对象的 key 数量为 0 的对象  
				clearGoodTypeListZero(state.list) // 清除购物车中 typeList 长度为 0 的商品
			}
		},
		CHOOSEDCHANGE(state, payload) { // 修改选择状态相关操作
			const index = payload[0], typeIndex = payload[1], key = payload[2]
			if (payload.length === 3) { // 点击 选择/取消 商品类型, 选择/取消 该商品商品类型,同时和 选择/取消 商品联动
				state.list[index].typeList[typeIndex].choosed[key] = !state.list[index].typeList[typeIndex].choosed[key]
				state.list[index].choosed = state.list[index].typeList.some(e => Object.keys(e.choosed).some(ee => e.choosed[ee] === true))
			} else if (payload.length === 1) { // 点击 选择/取消 商品, 选择/取消 该商品所有的类型
				state.list[index].choosed = !state.list[index].choosed
				state.list[index].typeList.forEach(e => Object.keys(e.choosed).forEach(ee => e.choosed[ee] = state.list[index].choosed))
			} else { // 点击 取消/全选
				const status = this.getters['shopcar/choosedAll']
				state.list.forEach(e => {
					e.choosed = !status
					e.typeList.forEach(ee => {
						Object.keys(ee.choosed).forEach(eee => {
							ee.choosed[eee] = !status
						})
					})
				})
			}
		}
	}
}
