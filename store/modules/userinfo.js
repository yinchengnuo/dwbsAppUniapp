import Vue from 'vue'

export default {
	namespaced: true,
	state: {},
	mutations: {
		UPDATA_USERINFO(state, payload) {
			Object.keys(payload).forEach(e => Vue.set(state, e, payload[e]))
		}
	}
}
