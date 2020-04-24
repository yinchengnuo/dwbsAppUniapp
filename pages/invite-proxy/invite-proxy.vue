<template>
	<view class="invite-proxy">
		<custom-nav ref="ltm" :title="title"></custom-nav>
		<view class="content">
			<view class="top">
				<image class="imagebg" src="../../static/icon/invite-proxy.png" mode="scaleToFill"></image>
				<view class="invite-code">
					<view class="text">我的邀请码</view>
					<text class="code">{{ invite_code }}</text>
					<text class="copy" @tap="copy">复制</text>
				</view>
			</view>
			<view class="bottom">
				<view class="item border-right">
					<view class="item-top">
						<text>{{ invite_num }}</text>人
					</view>
					<view class="item-bot">我的邀请</view>
				</view>
				<view class="item">
					<view class="item-top">
						<text>{{ team_num }}</text>人
					</view>
					<view class="item-bot">我的团队</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_InviteCode } from '@/apis/team.js'
	export default {
		data() {
			return {
				title: '邀请代理',
				invite_code: '',
				invite_num: 0,
				team_num: 0
			}
		},
		mounted() {
			this.$refs.ltm.loading()
			_API_InviteCode().then(res => {
				this.invite_code = res.data.invite_code
				this.invite_num = res.data.invite_num
				this.team_num = res.data.team_num
			})
		},
		methods: {
			copy() {
				uni.setClipboardData({ data: this.invite_code }).then(() => {
					uni.hideToast()
					this.$refs.ltm.toast('邀请码已复制到剪切板')
				})
			}
		}
	}
</script>

<style lang="scss">
	.invite-proxy {
		@include page();
		.content {
			@include flex(column);
			justify-content: space-between;
			.top {
				width: 100%;
				height: 820rpx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
				}
				.invite-code {
					@include flex(column);
					left: 50%;
					top: 383rpx;
					position: absolute;
					transform: translateX(-50%);
					.text {
						font-size: 27rpx;
					}
					.code {
						font-size: 41rpx;
						letter-spacing: 8rpx;
						margin: 50rpx 0 30rpx;
					}
					.copy {
						@include flex();
						width: 120rpx;
						height: 56rpx;
						font-size: 32rpx;
						border-radius: 28rpx;
						color: $app-base-color;
						border: 1rpx solid $app-base-color;
					}
				}
			}
			.bottom {
				@include flex();
				width: 690rpx;
				height: 230rpx;
				background: #FFFFFF;
				margin-bottom: 21rpx;
				border-radius:10rpx 10rpx 0rpx 0rpx;
				.item {
					@include flex(column);
					flex: 1;
					height: 200rpx;
					.item-top {
						text {
							font-size: 70rpx;
							color: $app-base-color;
						}
					}
					.item-bot {
						margin-top: 26rpx;
					}
				}
			}
		}
	}
</style>
