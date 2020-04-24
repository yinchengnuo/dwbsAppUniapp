import Vue from 'vue'
import App from '@/App'
import $store from '@/store'

Vue.prototype.$store = $store // vuex
Vue.prototype.$offset = function (selector) { // 获取元素宽高位置信息
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().in(this).select(selector).boundingClientRect(data => {
			data ? data.x = data.left + data.width / 2 : ''
			data ? data.y = data.top + data.height / 2 : ''
			data ? resolve(data) : reject('元素不存在')
		}).exec()
	})
}

import CustomNav from './components/public/custom-nav.vue' //自定义头部导航栏交互组件
Vue.component('custom-nav', CustomNav) //注册自定义头部导航栏

import * as filters from '@/filters'
Object.keys(filters).forEach(e => {
	Vue.filter(e, filters[e])
})
Vue.config.productionTip = false
;( new Vue( { ...App } ) ).$mount()