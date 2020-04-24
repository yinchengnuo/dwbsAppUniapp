export default {
	namespaced: true,
	state: {
		networkType: '', // 网络类型
		...uni.getSystemInfoSync(), // 系统信息
		bangs: plus.navigator.hasNotchInScreen(), // 查询设备是否为刘海屏
		statusbarHeight: plus.navigator.getStatusbarHeight() // 状态栏高度
	},
	mutations: {
		NETWORKTYPE_CHANGE(state, networkType) {
			state.networkType = networkType
		}
	}
}
