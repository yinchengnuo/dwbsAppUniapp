export default {
	namespaced: true,
	state: {
		index_tabbar_index: 0,
		version: plus.runtime.version,
		navtabbarHeight: uni.upx2px(128), // 自定义导航栏高
		indextabbarHeight: uni.upx2px(98), // 首页 tabbar 高
		token: uni.getStorageSync('token'),
		statusbarHeight: plus.navigator.getStatusbarHeight() // 状态栏高度
	},
	mutations: {
		LOGIN(state, payload) { // 登录 保存 token
			state.token = payload
			uni.setStorage({ key: 'token', data: payload })
		},
		LOGOUT(state) { // 退出登录 删除 token
			state.token = ''
			token: uni.removeStorageSync('token')
		}
		// SWITCHINDEXTAABARINDEX(state, payload) { // 切换首页 tabbar
		// 	state.index_tabbar_index = payload
		// }
	}
}
