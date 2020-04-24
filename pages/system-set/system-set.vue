<template>
	<view class="system-set">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<navigator class="app-item" url="../problem-feedback/problem-feedback">
				<text>问题反馈</text>
				<text class="cuIcon-right"></text>
			</navigator>
			<navigator class="app-item" url="../user-agreement/user-agreement">
				<text>用户协议</text>
				<text class="cuIcon-right"></text>
			</navigator>
			<view class="app-item item-space" @tap="checkoutNew">
				<text>检查更新</text>
				<text class="cuIcon-refresh"></text>
			</view>
			<view class="app-item" @tap="clearStorage">
				<text>清除缓存</text>
				<text class="cuIcon-right"></text>
			</view>
			<navigator class="app-item" url="../about-us/about-us">
				<text>关于我们</text>
				<text class="cuIcon-right"></text>
			</navigator>
			
			<view class="big-btn" @tap="logout">退出登录</view>
			
		</view>
	</view>
</template>

<script>
	import { _API_AppUpdata } from '@/apis/app.js'
	export default {
		data() {
			return {
				title: '系统设置'
			}
		},
		computed: {
			screenWidth() { return this.$store.state.device.screenWidth }, // 屏幕宽
			screenHeight() { return this.$store.state.device.screenHeight }, // 屏幕高
		},
		methods: {
			checkoutNew() { // 点击检查更新
				if (uni.UPDATING) {
					this.$refs.ltm.toast('新版本正在下载中：' + uni.UPDATAPROGRESS + '%')
				} else {
					this.$refs.ltm.loading()
					_API_AppUpdata().then(res => { // 获取更新链接
						if (res.data.version !== this.$store.state.app.version) { // 有新版本  /////////////////////////////
							const position = this.getNativeObjPosition(560/681)
							const pn = this.getNativeObjPosition(560/681)
							Object.keys(pn).forEach(key => pn[key] = Number(pn[key].split('px')[0]))
							const UPDATA = new plus.nativeObj.View('auth', // 定义升级弹窗
								{ top:'0px', left:'0px', height:'100%', width:'100%', backgroundColor: "rgba(0, 0 , 0, 0.6)" },
								[
									{ tag:'img', id:'authImg', src: '/static/icon/appupdata.png', position },
									{	tag:'font', id:'font1', text:'版本号：' + res.data.version, 
										textStyles:{ size: '18px', align: 'left', whiteSpace: 'normal', verticalAlign: 'top' }, 
										position:{ top: pn.top+pn.height/2-18+'px', left: pn.left+20+'px', width: '100%', height: '36px' },
									},
									{
										tag:'font', 
										id:'font2', 
										text:res.data.message, 
										textStyles:{ size: '16px', align: 'left', whiteSpace: 'normal', verticalAlign: 'top', overflow: 'ellipsis' }, 
										position:{ top: pn.top+pn.height/2+14 + 'px', left: pn.left+30+ 'px', width: pn.width-60 + 'px', height: pn.height/4 + 'px' },
									},
								],
							)
							UPDATA.addEventListener('click', e => { // 点击弹窗升级app
								if (this.isClickInArea(e, 560/681)) { // 如果点击图片区
									UPDATA.close() // 关闭弹窗
									this.$refs.ltm.modal('提示', ['新版本将在后台下载', '下载成功后会提示您安装'], 'noCancle').then(() => { // 提示后台下载
										uni.UPDATING = true // 标记 app 正在下载状态 为 true
										uni.UNIPROGRESS = 0 // 设置 app 下载进度为 0
										const downloadTask = _API_DownLoadNewVersion(res.data.url) // 发送请求
										downloadTask.onProgressUpdate((e) => uni.UNIPROGRESS = e.progress ) // 更新进度
										downloadTask.then(({ tempFilePath }) => { // app 下载成功后弹窗通知
											uni.UPDATING = false // 标记 app 正在下载状态 为 false
											uni.$emit('UPDATAAPP', tempFilePath) // 通知弹窗弹出
										} )
									})
								} else { // 如果点击背景区
									UPDATA.close()
								}
							})
							UPDATA.show() // 弹出升级弹窗
						} else {
							this.$refs.ltm.toast('已是最新版本')
						}
					})
				}
			},
			getNativeObjPosition(as) {
				const width = this.screenWidth * 0.8
				const height = width / as
				const top = (this.screenHeight - height) / 2
				const left = (this.screenWidth - width) / 2
				return {
					width: Math.floor(width) + 'px',
					height: Math.floor(height) + 'px',
					top: Math.floor(top) + 'px',
					left: Math.floor(left) + 'px'
				}
			},
			isClickInArea(e, as) { // 只有点击图片区域才返回 true
				let p = this.getNativeObjPosition(as)
				Object.keys(p).forEach(key => p[key] = Number(p[key].split('px')[0]))
				if ((e.pageX >= p.left) && (e.pageX <= (p.left + p.width)) && (e.pageY >= p.top) && (e.pageY <= (p.top + p.height))) {
					return true
				}
			},
			clearStorage() { // 点击清除缓存
				this.$refs.ltm.modal('提示', ['确定清除已经缓存的数据？']).then(() => {
					this.$store.commit('message/clearStorage')
					this.$refs.ltm.toast('清除成功')
				}).catch(() => {
					this.$refs.ltm.toast('取消清除')
				})
			},
			logout() { // 点击退出登录
				this.$store.commit('app/LOGOUT')
				uni.reLaunch({ url: '../login-reg/login-reg' })
			}
		}
	}
</script>

<style lang="scss">
	.system-set {
		@include page();
	}
</style>
