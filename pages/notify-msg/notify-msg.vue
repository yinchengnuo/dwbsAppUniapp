<template>
	<view class="msg-notify">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<navigator url="../notify-order/notify-order" class="app-item item">
				<image src="../../static/msg-notify/order-msg.png"></image>
				<view class="message">
					<text class="title">订单通知</text>
					<text class="preview">{{ previewOrderMessage }}</text>
					<text v-if="orderMessageNum" class="num">{{ orderMessageNum }}</text>
				</view>
			</navigator>
			<navigator url="../notify-system/notify-system" class="app-item item">
				<image src="../../static/msg-notify/system-msg.png"></image>
				<view class="message">
					<text class="title">系统通知</text>
					<text class="preview">{{ previewSystemMessage }}</text>
					<text v-if="systemMessageNum" class="num">{{ systemMessageNum }}</text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '消息通知'
			}
		},
		computed: {
			orderMessageNum() { return this.$store.getters['message/orderMessageNum'] }, // 订单通知维度数量
			systemMessageNum() { return this.$store.getters['message/systemMessageNum'] }, // 系统通知未读数量
			previewOrderMessage() { return this.$store.getters['message/previewOrderMessage'] }, // 订单通知预览文字
			previewSystemMessage() { return this.$store.getters['message/previewSystemMessage'] }, // 系统通知预览文字
		},
		onPullDownRefresh() {
			this.$store.dispatch('message/getMessage') // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息 // 获取系统消息
		}
	}
</script>

<style lang="scss">
	.msg-notify {
		@include page();
		.content {
			.item {
				height: 136rpx;
				background: #FFFFFF;
				justify-content: flex-start;
				margin-bottom: $app-item-line-height;
				image {
					width: 88rpx;
					height: 88rpx;
					margin-right: 24rpx;
				}
				.message {
					flex: 1;
					height: 100%;
					display: flex;
					position: relative;
					flex-direction: column;
					.title {
						height: 50rpx;
						font-size: 32rpx;
						margin-top: 32rpx;
					}
					.preview {
						width: 567rpx;
						font-size: 24rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: $app-sec-text-color;
					}
					.num {
						@include flex();
						top: 50%;
						right: 0;
						height: 30rpx;
						color: #FFFFFF;
						padding: 0 8rpx;
						font-size: 24rpx;
						min-width: 30rpx;
						position: absolute;
						border-radius: 15rpx;
						background: #FF0000;
						transform: translateY(-50%);
					}
				}
			}
		}
	}
</style>
