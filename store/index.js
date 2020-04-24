import Vue from 'vue'  //引入 Vue
import Vuex from 'vuex'  //引入 Vuex

import app from '@/store/modules/app'
import device from '@/store/modules/device'
import address from '@/store/modules/address'
import article from '@/store/modules/article'
import choosed from '@/store/modules/choosed'
import shopcar from '@/store/modules/shopcar'
import message from '@/store/modules/message'
import userinfo from '@/store/modules/userinfo'

Vue.use(Vuex)

const $store = new Vuex.Store({
	modules: {
		app,
		device,
		address,
		article,
		choosed,
		shopcar,
		message,
		userinfo
	}
})

export default $store