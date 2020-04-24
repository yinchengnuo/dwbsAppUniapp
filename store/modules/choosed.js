export default {
	namespaced: true,
	state: {
		list: []
	},
	getters: {
		S: state => state.list.reduce((t, e) => t + (e.size.S || 0), 0),
		M: state => state.list.reduce((t, e) => t + (e.size.M || 0), 0),
		L: state => state.list.reduce((t, e) => t + (e.size.L || 0), 0),
		XL: state => state.list.reduce((t, e) => t + (e.size.XL || 0), 0),
		XXL: state => state.list.reduce((t, e) => t + (e.size.XXL || 0), 0),
		XXXL: state => state.list.reduce((t, e) => t + (e.size.XXXL || 0), 0),
		total: state => state.list.reduce((t, e) => Object.keys(e.size).reduce((tt, ee) => tt + (e.size[ee] || 0), t), 0)
	},
	mutations: {
		CHOOSE(state, payload) { // 用户点击确定后将尺寸选择中的 choosed 放入 state 中
			state.list = payload
		},
		CLEAR(state) { // 退出页面/立即购买/加入购物车后清空 choosed
			state.list = []
		}
	}
}
