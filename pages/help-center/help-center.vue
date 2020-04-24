<template>
	<view class="help-center">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<view class="time">
				<text class="cuIcon-service"></text>
				<view class="title">在线客服</view>
				<view class="time1">客服服务时间：9:00-21:00</view>
				<view class="time2">双休、节假日：10:00-17:30</view>
				<view class="connect" @tap="call">联系客服</view>
			</view>
			<view class="q-a" v-for="(item, index) in list" :key="index" @tap="detail(index)" :class="{ open: activeDetail === index, close: activedDetail === index }">
				<view class="app-item q">
					<text>{{ item.q }}</text>
					<text class="cuIcon-right"></text>
				</view>
				<view class="a">
					{{ item.a }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '问题帮助',
				activeDetail: -1,
				activedDetail: -1,
				list: [
					{
						q: '如何绑定手机号？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					},
					{
						q: '如何进行实名认证？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					},
					{
						q: '如何订货下单？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					},
					{
						q: '如何分享邀请链接？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					},
					{
						q: '如何查看授权书？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					},
					{
						q: '如何转上级发货？',
						a: '在“我的”页面里点击“实名认证”，在弹出的页面中填写详细的 用户信息资料，填写完毕好点击提交按钮即可认证完成。'
					}
				]
			}
		},
		methods: {
			call() {
				uni.makePhoneCall({
				    phoneNumber: '18338112210'
				})
			},
			detail(index) {
				this.activedDetail = this.activeDetail
				this.activeDetail = index
			}
		}
	}
</script>

<style lang="scss">
	.help-center {
		@include page();
		.content {
			.time {
				@include flex(column);
				height: 270rpx;
				padding: 30rpx;
				color: #FFFFFF;
				position: relative;
				box-sizing: border-box;
				align-items: flex-start;
				background: $app-base-color;
				justify-content: space-between;
				.cuIcon-service {
					right: 0;
					bottom: 0;
					opacity: 0.15;
					font-size: 250rpx;
					position: absolute;
				}
				.title {
					font-size: 40rpx;
				}
				.time1, .time2 {
					font-size: 30rpx;
				}
				.connect {
					@include flex();
					width: 144rpx;
					height: 46rpx;
					font-size: 24rpx;
					border-radius: 6rpx;
					border:2px solid #FFFFFF;
				}
			}
			.q-a {
				&.open {
					.q {
						color: $app-base-color;
						.cuIcon-right {
							animation: rotate-right .3s;
							animation-fill-mode: forwards;
						}
					}
					.a {
						animation: a-show .3s;
						animation-fill-mode: forwards;
					}
				}
				&.close {
					.q {
						.cuIcon-right {
							animation: rotate-left .3s;
							animation-fill-mode: forwards;
						}
					}
					.a {
						animation: a-hide .3s;
						animation-fill-mode: forwards;
					}
				}
				.a {
					height: 0;
					overflow: auto;
					padding: 0 30rpx;
					font-size: 26rpx;
					line-height: 46rpx;
					box-sizing: border-box;
					color: $app-sec-text-color;
				}
			}
		}
	}
	@keyframes rotate-right {
		0% {
			transform: rotateZ(0);
		}
		100% {
			transform: rotateZ(90deg);
		}
	}
	@keyframes rotate-left {
		0% {
			transform: rotateZ(90deg);
		}
		100% {
			transform: rotateZ(0);
		}
	}
	@keyframes a-show {
		0% {
			height: 0;
		}
		100% {
			height: 184rpx;
		}
	}
	@keyframes a-hide {
		0% {
			height: 184rpx;
		}
		100% {
			height: 0;
		}
	}
</style>
