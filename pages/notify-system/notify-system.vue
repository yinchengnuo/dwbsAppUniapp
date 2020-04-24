<template>
	<view class="notify-system">
		<custom-nav ref="ltm" :title="title"></custom-nav>
		<view class="content">
			<scroll-view scroll-y :style="{ height: scrollviewHeight + 'px' }">
				<view class="item" v-for="(item, index) in systemList" :key="index">
					<view class="top"><text></text>{{ item.title }}</view>
					<view class="mid" @tap="toDetail(item.url)">{{ item.message }}&nbsp;&nbsp;<text v-if="item.url">点击查看详情 >>> </text></view>
					<view class="bot">{{ item.time | formatTime }}</view>
				</view>
				<view class="nomore" :class="{ empty: !systemList.length }">--暂无更多--</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { _API_AppMessage_Read } from '@/apis/app.js'
	export default {
		data() {
			return {
				title: '系统通知',
				scrollviewHeight: 0
			}
		},
		computed: {
			systemList() { return [...this.$store.state.message.system, ...this.$store.state.message.systemLocal] }
		},
		mounted() { // 设置scrollview 高
			this.$offset('.content').then(res => this.scrollviewHeight = res.height) // 设置scrollview 高
			if (this.$store.state.message.system.length) { // 当系统通知有未读消息时
			this.$refs.ltm.loading()
				_API_AppMessage_Read({ type: 1 }).then(res => { // 将我的订单未读消息设置位已读
					this.$store.commit('message/setStorage', 1)
				})
			}
		},
		methods: {
			toDetail(url) {
				if (url) {
					uni.navigateTo({ url: `../app-webview/app-webview?url=${url}` })
				}
			}
		}
	}
</script>

<style lang="scss">
	.notify-system {
		@include page();
		.content {
			.nomore {
				margin: 39rpx auto;
				text-align: center;
				&.empty {
					margin-top: 567rpx;
				}
			}
			.item {
				width: 690rpx;
				font-size: 26rpx;
				margin: 30rpx auto 0;
				background: #FFFFFF;
				border-radius: 10rpx;
				.top {
					@include flex();
					height: 58rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
					justify-content: flex-start;
					border-bottom: 1rpx solid $app-base-bg;
					>text {
						width: 6rpx;
						height: 24rpx;
						margin-right: 10rpx;
						background: $app-base-color;
					}
				}
				.mid {
					padding: 0 30rpx;
					line-height: 56rpx;
					box-sizing: border-box;
					color: $app-sec-text-color;
					text {
						margin-left: 10rpx;
						color: $app-base-color;
					}
				}
				.bot {
					height: 40rpx;
					font-size: 24rpx;
					padding: 0 30rpx;
					text-align: right;
					line-height: 40rpx;
					box-sizing: border-box;
					border-top: 1rpx solid $app-base-bg;
				}
			}
		}
	}
</style>
