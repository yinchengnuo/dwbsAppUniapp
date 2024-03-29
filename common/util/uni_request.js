const STATUS={PENDING:0,FULFILLED:1,REJECTED:2};class MyPromise{constructor(a){this.status=STATUS.PENDING,this.resolveData=null,this.rejectData=null,this.onFulfilledList=[],this.onRejectedList=[],this.onResolve=a=>{this.status===STATUS.PENDING&&(this.status=STATUS.FULFILLED,this.resolveData=a,this.onFulfilledList.forEach(a=>a(this.resolveData)))},this.onReject=a=>{this.status===STATUS.PENDING&&(this.status=STATUS.REJECTED,this.rejectData=a,this.onRejectedList.forEach(a=>a(this.rejectData)))},this.resolvePromise=(a,b,c)=>{if(a instanceof Promise)a.status===STATUS.PENDING?a.then(a=>{this.resolvePromise(a,b,c)},c):a.status===STATUS.FULFILLED?b(a.resolveData):c(a.rejectData);else if(null!==a&&a instanceof Object)try{let d=a.then;d instanceof Function?d.call(a,a=>{this.resolvePromise(a,b,c)},c):b(a)}catch(a){c(a)}else b(a)};try{a(this.onResolve.bind(this),this.onReject.bind(this))}catch(a){this.onReject(a)}}then(a,b){let c;return c=this.status===STATUS.PENDING?new Promise((c,d)=>{this.onFulfilledList.push(()=>{if(!(a instanceof Function))c(this.resolveData);else{let b=a(this.resolveData);this.resolvePromise(b,c,d)}}),this.onRejectedList.push(()=>{if(!(b instanceof Function))d(this.rejectData);else{let a=b(this.rejectData);this.resolvePromise(a,c,d)}})}):this.status===STATUS.FULFILLED?new Promise((b,c)=>{if(!(a instanceof Function))b(this.resolveData);else{let d=a(this.resolveData);this.resolvePromise(d,b,c)}}):new Promise((a,c)=>{if(!(b instanceof Function))c(this.rejectData);else{let d=b(this.rejectData);this.resolvePromise(d,a,c)}}),c}catch(a){a instanceof Function&&(this.status===STATUS.PENDING?this.onRejectedList.push(()=>{null!==this.rejectData&&a(this.rejectData)}):(this.status=STATUS.REJECTED)&&null!==this.rejectData&&a(this.rejectData))}}

export default function ({ baseURL, timeout, header }) {
	return {
		get(url, data) { return this.request('GET', url, data) },
		post(url, data) { return this.request('POST', url, data) },
		put(url, data) { return this.request('PUT', url, data) },
		delete(url, data) { return this.request('DELETE', url, data) },
		connect(url, data) { return this.request('CONNECT', url, data) },
		head(url, data) { return this.request('HEAD', url, data) },
		options(url, data) { return this.request('OPTIONS', url, data) },
		reace(url, data) { return this.request('TRACE', url, data) },
		uploadFile(url, data) { return this.file('uploadFile', url, data || {}) },
		downloadFile(url, data) { return this.file('downloadFile', url, data || {}) },
		onerror: [], // 请求错误钩子函数集合
		file(method, url, data) {
			let timer, requestTask, aborted = false, abort = () => { // timer 检测超时定时器，requestTask 网络请求 task 对象，aborted 请求是否已被取消，abort 取消请求方法
				aborted = true // 将请求状态标记为已取消
				requestTask ? requestTask.abort() : '' // 执行取消请求方法
			}, progressUpdateHandle, onProgressUpdate = e => progressUpdateHandle = e // progressUpdateHandle 监听上传进度变化回调，onProgressUpdate 监听上传进度变化方法
			return new Proxy(new MyPromise((resolve, reject) => { // 返回经过 Proxy 后的 Promise 对象使其可以监听到是否调用 abort 和 onProgressUpdate 方法
				this.interceptors.request.intercept({ header: data.header || {}, body: data.formData || {} }, method, url, data).then(async ({ header, body }) => { // 等待请求拦截器里的方法执行完
					if (aborted) { // 如果请求已被取消,停止执行,返回 reject
						await this.onerror(method, url, data, '网络请求失败：主动取消')
						return reject('网络请求失败：主动取消')
					}
					requestTask = uni[method]({
						url: url[0] === '/' ? baseURL + url : url,
						name: data.name,
						header,
						filePath: data.filePath,
						formData: body,
					    success: async res => {
							// clearTimeout(timer)
							res.statusCode !== 200 ? await this.onerror(method, url, data, `网络请求异常：服务器响应异常：状态码：${res.statusCode}`) : '',
							this.interceptors.response.intercept(res.statusCode === 200 ? resolve : reject, res, method, url, data) // 执行响应拦截器
					    },
						fail: async res => {
							// clearTimeout(timer)
							await this.onerror(method, url, data, aborted ? '网络请求失败：主动取消' : '网络请求失败：（URL无效|无网络|DNS解析失败）')
							aborted ? reject('网络请求失败：主动取消') : reject('网络请求失败：（URL无效|无网络|DNS解析失败）')
						}
					})
					requestTask.onProgressUpdate(progressUpdateHandle) // 监听下载进度变化
					// timer = setTimeout(async () => { // 请求超时执行方法
					// 	requestTask.abort() // 执行取消请求方法
					// 	await this.onerror(method, url, data, '网络请求失败：超时取消')
					// 	reject('网络请求时间超时') // reject 原因
					// }, timeout  || 12345) // 设定检测超时定时器
				})
			}), { get: (target, prop) => prop === 'abort' ? abort : prop === 'onProgressUpdate' ? onProgressUpdate : Reflect.get(target, prop) }) // 如果调用 cancel 方法,返回 _watcher.cancel 方法
		},
		request(method, url, data) {
			let timer, requestTask, aborted = false, abort = () => { // timer 检测超时定时器，requestTask 网络请求 task 对象，aborted 请求是否已被取消，abort 取消请求方法
				aborted = true // 将请求状态标记为已取消
				requestTask ? requestTask.abort() : '' // 执行取消请求方法
			}
			return new Proxy(new MyPromise((resolve, reject) => { // 返回经过 Proxy 后的 Promise 对象使其可以监听到是否调用 abort 方法
				this.interceptors.request.intercept({ header: header || {}, body: data || {} }, method, url, data).then(async ({ header, body: data }) => { // 等待请求拦截器里的方法执行完
					if (aborted) { // 如果请求已被取消,停止执行,返回 reject
						await this.onerror(method, url, data, '网络请求失败：主动取消')
						return reject('网络请求失败：主动取消')
					}
					requestTask = uni.request({
					    url: url[0] === '/' ? baseURL + url : url,
					    data, method, header,
					    success: async res => { // 网络请求成功
							clearTimeout(timer) // 清除检测超时定时器
							res.statusCode !== 200 ? await this.onerror(method, url, data, `网络请求异常：服务器响应异常：状态码：${res.statusCode}`) : '' 
							this.interceptors.response.intercept(res.statusCode === 200 ? resolve : reject, res, method, url, data) // 执行响应拦截器
					    },
						fail: async res => { // 网络请求失败
							clearTimeout(timer) // 清除检测超时定时器
							await this.onerror(method, url, data, aborted ? '网络请求失败：主动取消' : '网络请求失败：（URL无效|无网络|DNS解析失败）')
							aborted ? reject('网络请求失败：主动取消') : reject('网络请求失败：（URL无效|无网络|DNS解析失败）')
						}
					})
					timer = setTimeout(async () => { // 请求超时执行方法
						requestTask.abort() // 执行取消请求方法
						await this.onerror(method, url, data, '网络请求失败：超时取消')
						reject('网络请求时间超时') // reject 原因
					}, timeout  || 12345) // 设定检测超时定时器
				})
			}), { get: (target, prop) => prop === 'abort' ? abort : Reflect.get(target, prop) }) // 如果调用 abort 方法,返回 abort 方法
		},
		interceptors: { // 拦截器
			request: {
				interceptors: [],
				use(fun) { this.interceptors.push(fun) },
				async intercept(config, method, url, data) {
					for (let i = 0; i < this.interceptors.length; i ++) {
						config = await this.interceptors[i](config, method, url, data)
					}
					return config
				}
			},
			response: {
				interceptors: [],
				use(fun) { this.interceptors.push(fun) },
				async intercept(STATUS, response, method, url, data) {
					if (method === 'downloadFile') {
						return STATUS(response)
					} else {
						for (let i = 0; i < this.interceptors.length; i ++) {
							response = await this.interceptors[i](response, method, url, data)
						}
						return STATUS(typeof response.data === 'string' ? JSON.parse(response.data) : response.data)
					}
				}
			}
		}
	}
}