import Vue from 'vue'
import $store from '@/store'
import uni_request from './uni_request.js'

// const host = 'http://192.168.0.14'
// const host = 'http://192.168.0.13'
const host = 'https://yinchengnuo.com'
// const host = 'http://api.app.jiuweiyun.cn'
// const host = 'http://192.168.2.109'
// const port = 80
const port = 443
const url = '/dwbsapp'
// const url = '/api'

uni.onNetworkStatusChange(res => { $store.commit('device/NETWORKTYPE_CHANGE', res.networkType) }) // 网络类型变化监听
uni.getNetworkType({ success(res) { $store.commit('device/NETWORKTYPE_CHANGE', res.networkType) }}) // 获取网络类型

const request = uni_request({
	timeout: 12345,
	baseURL: `${host}:${port}${url}`,
})

request.interceptors.request.use(config => {
	config.header.Authorization = 'Bearer ' + $store.state.app.token
	return config
})

request.interceptors.response.use((response, ...args) => { // 拦截器
	uni.$emit('HIDELOADING') // 隐藏加载
	uni.stopPullDownRefresh() // 停止下拉刷新
	plus.nativeUI.closeWaiting() // 停止loading
	if (response.statusCode === 200) { 
		if (+response.data.code === 202) {
			uni.$emit('TOAST', response.data.message)
		}
	} else if (response.statusCode === 401) { // 服务器响应不为 200 的统一处理方法
		uni.$emit('TOAST', '登录信息过期,请重新登录')
		uni.$emit('RELAUNCH')
	} else {
		uni.$emit('TOAST', `网络好像出了点问题:${response.statusCode}/${args[1]}`)
	}
	return response
})

request.onerror = (...args) => { // 请求失败统一处理方法
	uni.$emit('HIDELOADING') // 隐藏加载
	uni.stopPullDownRefresh() // 停止下拉刷新
	uni.$emit('TOAST', `网络好像出了点问题`)
}

export default request
export const FlashScreenUrl = 'https://api.jiuweiyun.cn/public/uploads/images/topics/420.jpg' // app 闪屏固定url
export const ArticleURL = `${host}:${port}${url}/article/show_article` // 文章固定链接
// export const ArticleURL = `https://mp.weixin.qq.com/s/O5Q00WQhCYXI6Mky_ExPOw` // 文章固定链接