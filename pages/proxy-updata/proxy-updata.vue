<template>
	<view class="proxy-updata">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view v-if="status == 0">
				<view class="title">
					<text>专享活动折扣</text>
					<text class="how" @tap="howToUpdata">如何升级?</text>
				</view>
				<view class="card">
					<image v-if="level === '特级代理'" class="img-card" src="../../static/icon/super_price.png"></image>
					<image v-else class="img-card" src="../../static/icon/top_price.png"></image>
					<text class="price">￥{{ level === '特级代理' ? top_money : crown_money }}.00</text>
					<text v-if="isActive" class="time">截止时间：{{ days }}天{{ hours }}时{{ minutes }}分{{ seconds }}秒</text>
					<text v-else class="time">活动未开始</text>
				</view>
				<view class="updata-detail">
					<view class="detail-item">
						<image class="img-wra" src="../../static/icon/updata_wrapper.png"></image>
						<view class="content">
							<view class="left">
								<text class="level">升级为顶级代理</text>
								<text class="price">活动价：￥{{ top_money | numDot }}</text>
								<text v-if="isActive" class="date">使用期限：2020年1月1日—1月3日</text>
							</view>
							<view class="right">
								<text class="price">￥{{ top_money | numDot }}</text>
								<text class="status" :class="{ can: isActive && updata == 1 }"  @tap="upload(1)">{{ isActive ? updata == 1 ? '立即升级' : '等级不符' : '暂未开始' }}</text>
							</view>
						</view>
					</view>
					<view class="detail-item">
						<image class="img-wra" src="../../static/icon/updata_wrapper.png"></image>
						<view class="content">
							<view class="left">
								<text class="level">升级为皇冠代理</text>
								<text class="price">活动价：￥{{ crown_money | numDot }}</text>
								<text v-if="isActive" class="date">使用期限：2020年1月1日—1月3日</text>
							</view>
							<view class="right">
								<text class="price">￥{{ crown_money | numDot }}</text>
								<text class="status" :class="{ can: isActive && updata == 2 }" @tap="upload(2)">{{ isActive ? updata == 2 ? '立即升级' : '等级不符' : '暂未开始' }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="more">~期待更多~</view>
			</view>
			<view v-else class="examining">
				<image class="ok" src="../../static/icon/ok.png"></image>
				<view class="text">下单成功，请等待审核确认...</view>
				<view class="big-btn" @tap="know">我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_Proxy_Updata } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '代理升级',
				end: 0,
				start: 0,
				updata: 0, // 代理可升的级别 0 不可升级 1 可升为顶级代理 2 可升为皇冠代理
				status: 0, // 0 正常 1 审核中
				top_money: 0,
				crown_money: 0,
				isActive: false,
				level: this.$store.state.userinfo.level,
				countdown: 0,
				days: '00',
				hours: '00',
				minutes: '00',
				seconds: '00',
				timer: null
			}
		},
		mounted() {
			uni.$on('UPLOADED', () => this.status = 1)
			this.$refs.ltm.loading()
			_API_Proxy_Updata().then(res => {
				if (res.code === 200) {
					this.status = +res.data.status
					this.isActive = res.data.isActive,
					this.updata = +res.data.updata
					this.start = res.data.start
					this.end = res.data.end
					this.top_money = res.data.top_money
					this.crown_money = res.data.crown_money
					if (this.isActive) {
						this.computCountdown()
						this.timer = setInterval(() => {
							this.computCountdown()
						}, 1000)
					}
				}
			})
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			computCountdown () {
				this.countdown = +this.end - Date.now()
				if (this.countdown <= 0) {
					this.isActive = false
					clearInterval(this.timer)
					this.$refs.ltm.toast('活动已经结束，感谢关注')
				} else {
					this.days = (parseInt(this.countdown / (1000 * 60 * 60 * 24)) + '')
					this.hours = (parseInt(this.countdown % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) + '').length === 1 ? 
					'0' + parseInt(this.countdown % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)) : 
					parseInt(this.countdown % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
					this.minutes = (parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60)) + '').length === 1 ? 
					'0' + parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60)) : 
					parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60))
					this.seconds = (parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000) + '').length === 1 ? 
					'0' + parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000) : 
					parseInt(this.countdown % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000)
				}
			},
			know() {
				uni.navigateBack()
			},
			howToUpdata() {
				uni.navigateTo({ url: '../how-updata/how-updata' })
			},
			upload(updata) {
				if (+this.updata == updata) { // 当可以升级时跳转到上传图片页面
					uni.navigateTo({ url: '../my-updata/my-updata' })
				}
			}
		}
	}
</script>

<style lang="scss">
	.proxy-updata {
		@include page();
		.content {
			padding-top: 460rpx;
			.examining {
				@include flex(column);
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				position: absolute;
				background: #FFFFFF;
				justify-content: flex-start;
				image {
					width: 228rpx;
					height: 228rpx;
					margin-top: 145rpx;
				}
				.text {
					font-size: 36rpx;
					text-align: center;
					margin: 100rpx 0 119rpx;
				}
				.big-btn {
					margin: 0;
					width: 480rpx;
				}
			}
			.title {
				@include flex();
				top: 0;
				left: 0;
				right: 0;
				height: 244rpx;
				font-size: 40rpx;
				padding-top: 40rpx;
				position: absolute;
				box-sizing: border-box;
				align-items: flex-start;
				border-bottom-left-radius: 350rpx 56rpx;
				border-bottom-right-radius: 350rpx 56rpx;
				background: linear-gradient(0deg, rgba(229,194,158,1) 0%, rgba(206,182,144,1) 100%);
				.how {
					@include flex();
					top: 47rpx;
					right: 30rpx;
					width: 140rpx;
					height: 42rpx;
					color: #774F24;
					font-size: 24rpx;
					position: absolute;
					border-radius: 21rpx;
					background: rgba(0, 0, 0, .05);
				}
			}
			.card {
				top: 123rpx;
				left: 31rpx;
				width: 688rpx;
				height: 304rpx;
				overflow: hidden;
				position: absolute;
				border-radius: 15rpx;
				.img-card {
					width: 100%;
					height: 100%;
					position: absolute;
				}
				.price {
					top: 137rpx;
					right: 60rpx;
					width: 340rpx;
					color: #DFA757;
					font-size: 50rpx;
					text-align: center;
					position: absolute;
				}
				.time {
					top: 243rpx;
					right: 60rpx;
					width: 340rpx;
					color: #FFFFFF;
					font-size: 26rpx;
					text-align: center;
					position: absolute;
				}
			}
			.more {
				font-size: 24rpx;
				margin-top: 40rpx;
				text-align: center;
			}
			.updata-detail {
				.detail-item {
					width: 683rpx;
					height: 166rpx;
					position: relative;
					margin: 30rpx auto 0;
					.img-wra {
						width: 100%;
						height: 100%;
						position: absolute;
					}
					.content {
						@include flex();
						top: 0;
						right: 0;
						height: 100%;
						width: 623rpx;
						position: absolute;
						box-sizing: border-box;
						padding: 30rpx 18rpx 26rpx 36rpx;
						justify-content: space-between;
						.left, .right {
							@include flex(column);
							height: 100%;
							font-size: 24rpx;
							align-items: flex-start;
							justify-content: flex-start;
							&.left {
								flex: 1;
								.name {
									font-size: 32rpx;
								}
								.price {
									margin: 12rpx 0;
								}
								.date {
									color: $app-sec-text-color;
								}
							}
							&.right {
								align-items: center;
								justify-content: space-between;
								.price {
									color: #DFA757;
								}
								.status {
									@include flex();
									width: 126rpx;
									height: 50rpx;
									color: #FFFFFF;
									border-radius: 5rpx;
									background: rgba(153,153,153,1);
									&.can {
										background: #CEB690;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
