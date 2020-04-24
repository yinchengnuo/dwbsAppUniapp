<template>
	<view class="index-index">
		<custom-nav class="title" :title="title" ref="ltm" noback @rTap="rTap">
			<text class="cuIcon-question"></text>
		</custom-nav>
		<view v-if="logged" class="content">
			<view class="area manage">
				<navigator v-for="(item, index) in namageList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</navigator>
			</view>
			<view class="area swiper">
				<swiper :autoplay="true" :circular="true" :interval="3456" :duration="345">
					<swiper-item v-for="(item, index) in swiper" :key="index" @tap="toSwiperDetail(index)">
						<image :src="item.imgurl"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="area news">
				<image src="../../static/index/index/news.png"></image>
				<view class="hot">热点</view>
				<swiper :vertical="true" :autoplay="true" :circular="true" :interval="3456" :duration="345">
					<swiper-item class="ellipsis" v-for="(item, index) in news" :key="index">
						{{ item.contents}}
					</swiper-item>
				</swiper>
			</view>
			<view class="area kingkong">
				<navigator v-for="(item, index) in kingkongList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</navigator>
			</view>
			<view class="area article">
				<view class="area-name">
					<text class="border"></text>
					<text>常来微聊</text>
				</view>
				<view class="article-body" @tap="toDetail">
					<image class="left" :src="article.imgurl[0]"></image>
					<view class="right">
						<view class="title ellipsis">{{ article.title || '' }}</view>
						<view class="des">{{ article.summary || '' }}...</view>
						<view class="time-auth">
							<view class="time">{{ article.created_at | formatTime }}</view>
							<view class="auth">发布人：{{ article.author || '' }}</view>
						</view>
					</view>
				</view>
				<view @tap="toMore" class="more-article">显示更多<text class="cuIcon-right"></text></view>
			</view>
		</view>
		<view v-else class="login-btn" style="height: 100%;">
			<navigator open-type="reLaunch" url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import { _API_IndexIndex, _API_AppUpdata, _API_DownLoadNewVersion } from '@/apis/app.js'
	import { _API_GetUserStatus, _API_GetUserInfo, _API_ConfireLevel } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '首页',
				namageList: [
					{
						name: '订单管理',
						url: '../../pages/manage-order/manage-order',
						image: '../../static/index/index/manage-order.png'
					},
					{
						name: '人员管理',
						url: '../../pages/manage-people/manage-people',
						image: '../../static/index/index/manage-poeple.png'
					},
					{
						name: '财富管理',
						url: '../../pages/manage-money/manage-money',
						image: '../../static/index/index/manage-money.png'
					}
				],
				news: {},
				swiper: [],
				article: {},
				kingkongList: [
					{
						name: '订货下单',
						url: '../../pages/place-order/place-order',
						image: '../../static/index/index/place-order.png'
					},
					{
						name: '我的订单',
						url: '../../pages/my-order/my-order',
						image: '../../static/index/index/my-order.png'
					},
					{
						name: '下级订单',
						url: '../../pages/down-order/down-order',
						image: '../../static/index/index/down-order.png'
					},
					{
						name: '我的库存',
						url: '../../pages/my-storage/my-storage',
						image: '../../static/index/index/my-stock.png'
					},
					{
						name: '邀请代理',
						url: '../../pages/invite-proxy/invite-proxy',
						image: '../../static/index/index/invite-proxy.png'
					},
					{
						name: '注册审核',
						url: '../../pages/register-examine/register-examine',
						image: '../../static/index/index/register-examine.png'
					},
					{
						name: '我的邀请',
						url: '../../pages/my-invite/my-invite',
						image: '../../static/index/index/my-invite.png'
					},
					{
						name: '团队管理',
						url: '../../pages/team-manage/team-manage',
						image: '../../static/index/index/team-manage.png'
					}
				]
			}
		},
		computed: {
			userinfo() { return this.$store.state.userinfo }, // 用户信息
			screenWidth() { return this.$store.state.device.screenWidth }, // 屏幕宽
			logged() { return this.$store.state.app.token ? true : false}, // 用户是否登录
			screenHeight() { return this.$store.state.device.screenHeight }, // 屏幕高
		},
		mounted() { // 页面创建后判断用户状态
			uni.$on('RELAUNCH', () => uni.reLaunch({ url: '../login-reg/login-reg' })) // 监听 token 失效事件，跳转到登录页
			if (this.$store.state.app.token) { // 当用户处于登陆状态
				_API_GetUserStatus().then(res => { // 获取用户状态
					this.$store.commit('userinfo/UPDATA_USERINFO', res.data) // 获取用户状态后保存在 vuex 中
					if (res.data.status == 1) { // 用户状态为 1 表示正常
						if (res.data.cert_status == 0) { // 用户认证状态为 0 表示 已注册 未填写信息
							this.indexRequest() // 请求首页数据
							// 等待闪屏结束后弹出身份验证弹窗
							uni.HIDESCREENED ? this.showAuth() : uni.$on('HIDESCREEN', () => this.showAuth())
						} else if (res.data.cert_status > 0 && res.data.cert_status < 6) { // 用户为认证状态
							uni.reLaunch({ url: '../auth-progress/auth-progress' }) // 跳转到用户认证进度页面
						} else if (res.data.cert_status == 6) { // 用户认证完成
							this.indexRequest() // 请求首页数据
							_API_GetUserInfo().then(res => { // 请求用户信息
								this.$store.commit('userinfo/UPDATA_USERINFO', res.data) // 获取用户信息后保存在 vuex 中
								// 等待闪屏结束后判断用户等级是否发生改变
								uni.HIDESCREENED ? this.isLevelChanged(res) : uni.$on('HIDESCREEN', () => this.isLevelChanged(res))
							})
							this.$store.dispatch('message/getMessage') // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息
						}
					} else if (res.data.status == 0) { // 用户状态为 0 表示用户已被冻结
						this.$store.commit('app/LOGOUT')
						this.$refs.ltm.modal('提示', ['您已退出大卫博士'], 'noCancle').then(() => {
							uni.reLaunch({ url: '../login-reg/login-reg' })
						})
					}
				})
			}
		},
		onPullDownRefresh() { // 下拉刷新
			this.indexRequest()
		},
		methods: {
			rTap() { uni.navigateTo({ url: '../help-use/help-use' }) }, // 点击导航栏帮助
			toSwiperDetail(index) { // 点击轮播图
				if (this.swiper[index].is_jump == 1) {
					uni.navigateTo({ url: `../app-webview/app-webview?url=${this.swiper[index].url}` })
				}
			},
			toDetail() { // 点击首页文章
				if (this.article.id) {
					uni.navigateTo({ url: '/pages/article-detail/article-detail?fromIndex=1' })
				}
			},
			toMore() { // 点击文章查看更多
				uni.setStorageSync('_INDEXARTICLETAP', '_INDEXARTICLETAP') // 利用本地存储传参
				uni.switchTab({ url: '../index-commu/index-commu' })
			},
			indexRequest() { // 请求首页数据
				_API_IndexIndex().then(res => {
					// uni.json(res)
					uni.stopPullDownRefresh()
					this.news = res.data.news
					this.swiper = res.data.swiper,
					this.article = res.data.article
					this.$store.commit('article/ADDINDEX', this.article)
				})
			},
			showAuth() { // 弹出身份验证弹窗
				uni.AUTH = this.getNativeObj('/static/icon/auth-float.png', 1, 576/696)
				uni.AUTH.addEventListener('click', () => { // 点击弹窗跳转到身份验证页面
					uni.reLaunch({ url: '../auth-identity/auth-identity' })
				})
				uni.AUTH.show()
			},
			isLevelChanged(res) { // 检测用户等级是否发生变化
				if (+res.data.level_change == 0) { // 如果用户等级没有变化
					this.upData() // 检查更新
				} else { // 如果用户等级发送变化，等待用户确认等级变化后再检查更新
					this.showLevelChanged().then(() => {
						_API_ConfireLevel() // 用户确认等级变动请求
						this.upData() // 检查更新
					})
				}
			},
			showLevelChanged() { // 根据用户等级一级变化情况弹出相应提示
				let LEVELCHANGED;
				return new Promise(resolve => {
					if (this.userinfo.level == '皇冠代理') {
						if (+this.userinfo.level_change == 1) { // 升为皇冠
							LEVELCHANGED = this.getNativeObj('/static/icon/upToCrown.png', 2, 576/676)
						}
					} else if (this.userinfo.level == '顶级代理') {
						if (+this.userinfo.level_change == 1) { // 升为顶级
							LEVELCHANGED = this.getNativeObj('/static/icon/upToTop.png', 2, 576/676)
						} else if (+this.userinfo.level_change == -1) { // 降为顶级
							LEVELCHANGED = this.getNativeObj('/static/icon/downToTop.png', 2, 576/676)
						}
					} else if (this.userinfo.level == '特级代理') {
						if (+this.userinfo.level_change == -1) { // 降为特级
							LEVELCHANGED = this.getNativeObj('/static/icon/downToSuper.png', 2, 576/676)
						}
					}
					LEVELCHANGED.addEventListener('click', e => { // 点击弹等级变动弹窗确认等级变动
						if (this.isClickInArea(e, 576/676)) { 
							resolve(); // 用户确认等级变动
							LEVELCHANGED.hide() // 隐藏等级变动弹窗
						}
					})
					LEVELCHANGED.show()
				})
			},
			upData() { // app 检查更新
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
									uni.UPDATAPROGRESS = 0 // 设置 app 下载进度为 0
									const downloadTask = _API_DownLoadNewVersion(res.data.url) // 发送请求
									downloadTask.onProgressUpdate((e) => uni.UPDATAPROGRESS = e.progress ) // 更新进度
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
					}
				})
			},
			getNativeObj(src, id, as) { // 绘制透明背景弹窗
				return new plus.nativeObj.View('alert' + id,
					{ top:'0px', left:'0px', height:'100%', width:'100%', backgroundColor: "rgba(0, 0 , 0, 0.6)" },
					[{tag:'img', id:'alertImg' + id, src, position: this.getNativeObjPosition(as) }],
				)
			},
			getNativeObjPosition(as) { // 获取透明背景弹窗图片区位置
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
			isClickInArea(e, as) { // 检测点击透明背景弹窗是否为图片区
				let p = this.getNativeObjPosition(as)
				Object.keys(p).forEach(key => p[key] = Number(p[key].split('px')[0]))
				if ((e.pageX >= p.left) && (e.pageX <= (p.left + p.width)) && (e.pageY >= p.top) && (e.pageY <= (p.top + p.height))) {
					return true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-index {
		@include page();
		.title {
			.cuIcon-question {
				font-size: 38rpx;
				margin-right: 30rpx;
			}
		}
		.content {
			.area {
				background: #FFFFFF;
				&.manage {
					height: 170rpx;
					display: flex;
					navigator {
						flex: 1;
						height: 100%;
						display: flex;
						align-items: center;
						flex-direction: column;
						image {
							width: 94rpx;
							height: 94rpx;
							margin-top: 20rpx;
						}
						text {
							font-size:32rpx;
							margin-top: 10rpx;
						}
					}
				}
				&.swiper {
					height: 250rpx;
					margin-top: 12rpx;
					swiper {
						height: 100%;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
				&.news {
					display: flex;
					height: 50rpx;
					padding: 10rpx 30rpx;
					box-sizing: border-box;
					image {
						height: 100%;
						width: 180rpx;
					}
					.hot {
						@include flex();
						width: 72rpx;
						height: 100%;
						font-size: 24rpx;
						margin-left: 10rpx;
						border-radius: 4rpx;
						color: $app-base-color;
						border:1px solid $app-base-color;
					}
					swiper {
						flex: 1;
						height: 100%;
						font-size: 26rpx;
						margin-left: 20rpx;
					}
				}
				&.article {
					margin-top: 10rpx;
					.area-name {
						@include flex();
						height: 72rpx;
						font-size: 32rpx;
						padding: 0 30rpx;
						box-sizing: border-box;
						justify-content: flex-start;
						border-bottom: 1rpx solid $app-base-bg;
						.border {
							width: 6rpx;
							height: 30rpx;
							margin-right: 16rpx;
							background: $app-base-color;
						}
					}
					.article-body {
						@include flex();
						height: 200rpx;
						padding: 10rpx 30rpx;
						box-sizing: border-box;
						.left {
							width: 180rpx;
							height: 180rpx;
							margin-right: 30rpx;
							border-radius: 10rpx;
						}
						.right {
							@include flex(column);
							flex: 1;
							height: 100%;
							align-items: flex-start;
							justify-content: space-between;
							.title {
								width: 444rpx;
								font-size: 32rpx;
							}
							.des {
								flex: 1;
								width: 100%;
								margin: 2rpx 0;
								font-size: 24rpx;
								line-height: 34rpx;
								overflow: scroll;
							}
							.time-auth {
								@include flex();
								width: 100%;
								font-size: 24rpx;
								color: $app-sec-text-color;
								justify-content: space-between;
							}
						}
					}
					.more-article {
						@include flex();
						height: 72rpx;
						font-size: 26rpx;
						border-top: 1rpx solid $app-base-bg;
					}
				}
			}
		}
	}
</style>
