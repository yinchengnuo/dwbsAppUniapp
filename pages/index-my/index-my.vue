<template>
	<view class="index-my">
		<custom-nav ref="ltm" :title="title" transparent noback></custom-nav>
		<navigator class="login-reg" v-if="!logged" url="../../pages/login-reg/login-reg"></navigator>
		<view class="content tabbar">
			<view class="area info">
				<image class="bg" src="../../static/index/my/my-bg.png" mode=""></image>
				<view class="userinfo">
					<view class="headpic">
						<image v-if="logged" class="head" :src="userinfo.avatar"></image>
						<image v-else class="head" src="../../static/index/my/defaultimg.png"></image>
						<image v-if="userinfo.store" class="medal" src="../../static/index/my/medal.png"></image>
					</view>
					<view class="center">
						<view class="top">
							<text class="username">{{ logged ? userinfo.nickname : '请登录' }}</text>
							<text v-if="logged" class="level-name"><text class="cuIcon-crownfill"></text>{{ userinfo.level }}</text>
						</view>
						<view class="bot" v-if="logged">
							<text class="userid">ID:{{ userinfo.uuid || '' }}</text>
						</view>
					</view>
					<navigator class="editinfo" :url="'../../pages/person-card/person-card?id=' + userinfo.id + '&self=1'">
						<text>我的名片</text>
						<text class="cuIcon-right"></text>
					</navigator>
				</view>
				<view class="numinfo">
					<navigator url="../../pages/my-order/my-order?type=0" class="numitem">
						<text class="num">{{ userinfo.order_num1 || 0 }}</text>
						<text class="numname">待审核</text>
					</navigator>
					<navigator url="../../pages/my-order/my-order?type=1" class="numitem">
						<text class="num">{{ userinfo.order_num2 || 0 }}</text>
						<text class="numname">待收货</text>
					</navigator>
					<navigator url="../../pages/my-order/my-order?type=2" class="numitem">
						<text class="num">{{ userinfo.order_num3 || 0 }}</text>
						<text class="numname">已完成</text>
					</navigator>
				</view>
			</view>
			<navigator url="../../pages/proxy-updata/proxy-updata" class="card">
				<image src="../../static/index/my/user-up.png"></image>
			</navigator>
			<view class="area active">
				<view class="active-item" v-for="(item, index) in activeList" :url="item.url" :key="index" @tap="toActive(index)">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
			<view class="area appfun">
				<navigator class="app-item" v-for="(item, index) in appfunList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text class="itemname">{{ item.name }}</text>
					<text class="cuIcon-right"></text>
					<text v-if="index === 0 && messageNum" class="num">{{ messageNum }}</text>
				</navigator>
			</view>
			<view class="area systemset">
				<navigator class="app-item" url="../../pages/system-set/system-set">
					<image src="../../static/index/my/set.png"></image>
					<text class="itemname">系统设置</text>
					<text class="cuIcon-right"></text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_GetUserStatus, _API_GetUserInfo, _API_ConfireLevel } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '我的',
				activeList: [
					{
						name: '争霸赛',
						image: '../../static/index/my/zhengbasai.png'
					},
					{
						name: '线下沙龙',
						image: '../../static/index/my/shalong.png'
					},
					{
						name: '密训营',
						image: '../../static/index/my/mixun.png'
					}
				],
				appfunList: [
					{
						name: '消息通知',
						url: '../../pages/notify-msg/notify-msg',
						image: '../../static/index/my/message.png'
					},
					{
						name: '安全管理',
						url: '../../pages/safe-manage/safe-manage',
						image: '../../static/index/my/safe.png'
					},
					{
						name: '我的授权',
						url: '../../pages/auth-card/auth-card',
						image: '../../static/index/my/auth.png'
					},
					{
						name: '问题帮助',
						url: '../../pages/help-center/help-center',
						image: '../../static/index/my/help.png'
					}
				]
			}
		},
		computed: {
			userinfo() { return this.$store.state.userinfo },
			logged() { return this.$store.state.app.token ? true : false },
			messageNum() { return this.$store.getters['message/messageNum'] }
		},
		methods: {
			toActive(index) {
				if (index === 0) {
					this.$refs.ltm.loading()
					plus.share.getServices(list => {
							try{
								list.find(e => e.id === 'weixin').launchMiniProgram({ id:'gh_ccc3d7c5cbe0' })
								this.$refs.ltm.hideLoading()
							}catch(e){
								this.$refs.ltm.toast('唤起争霸赛小程序失败，请手动打开')
								this.$refs.ltm.hideLoading()
							}
						}, e => {
							this.$refs.ltm.toast('获取分享服务列表失败，请手动打开小程序')
						})
				} else {
					this.$refs.ltm.toast('暂未开放')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-my {
		@include page();
		border-top: none;
		.login-reg {
			top: 0;
			left: 0;
			right: 0;
			z-index: 2;
			position: absolute;
			background: transparent;
			bottom: $app-tabbar-height;
		}
		.content {
			.card {
				left: 50%;
				top: 410rpx;
				height: 90rpx;
				width: 690rpx;
				position: absolute;
				transform: translateX(-50%);
				image {
					width: 100%;
					height: 100%;
				}
			}
			.area {
				background: #FFFFFF;
				&.info {
					height: 437rpx;
					position: relative;
					.bg {
						z-index: 0;
						width: 100%;
						height: 100%;
						position: absolute;
					}
					.userinfo {
						top: 158rpx;
						width: 100%;
						display: flex;
						height: 100rpx;
						padding: 0 30rpx;
						position: absolute;
						box-sizing: border-box;
						.headpic {
							height: 100%;
							width: 100rpx;
							position: relative;
							.head {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
							.medal {
								right: -10rpx;
								bottom: -20rpx;
								width: 50rpx;
								height: 60rpx;
								position: absolute;
							}
						}
						.center {
							@include flex(column);
							flex: 1;
							height: 100%;
							margin: 0 16rpx;
							.top, .bot {
								flex: 1;
								width: 100%;
								display: flex;
								align-items: center;
								.username {
									font-size: 32rpx;
									margin-right: 16rpx;
									max-width: calc(100% - 130rpx);
								}
								.userid {
									color: #666666;
									font-size: 24rpx;
									margin-right: 26rpx;
								}
								.realname-img {
									width: 34rpx;
									height: 26rpx;
									margin-right: 10rpx;
								}
								.realname-text {
									color: #666666;
									font-size: 24rpx;
									&.noreal {
										color: $app-base-color;
									}
								}
							}
						}
						.editinfo {
							@include flex();
							height: 100%;
							width: 150rpx;
							font-size: 26rpx;
							.cuIcon-right {
								margin-left: 6rpx;
							}
						}
					}
					.numinfo {
						@include flex();
						bottom: 0;
						width: 100%;
						height: 140rpx;
						position: absolute;
						box-shadow: 0px -1px 5px 0px rgba(126,126,126,0.11);
						background: linear-gradient(0deg,rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) 100%);
						.numitem {
							flex: 1;
							height: 100%;
							@include flex(column);
							.num {
								font-size: 36rpx;
								color: #7B5533;
								margin-top: 12rpx 0 26rpx;
							}
							.numname {
								font-size: 26rpx;
							}
						}
					}
				}
				&.active {
					height: 180rpx;
					margin-top: 74rpx;
					display: flex;
					.active-item {
						@include flex(column);
						flex: 1;
						height: 100%;
						image {
							width: 88rpx;
							height: 88rpx;
							margin-top: 24rpx;
						}
						text {
							font-size: 26rpx;
							margin-top: 16rpx;
						}
					}
				}
				&.appfun, &.systemset {
					margin-top: 10rpx;
					background: $app-base-bg;
					navigator {
						position: relative;
						image {
							width: 38rpx;
							height: 38rpx;
						}
						.itemname {
							flex: 1;
							margin-left: 16rpx;
						}
						.num {
							@include flex();
							top: 50%;
							right: 66rpx;
							height: 30rpx;
							color: #FFFFFF;
							padding: 0 8rpx;
							font-size: 24rpx;
							min-width: 30rpx;
							position: absolute;
							background: #FF0000;
							border-radius: 15rpx;
							transform: translateY(-50%);
						}
					}
				}
			}
		}
	}
</style>
