<template>
	<view class="auth-progress">
		<custom-nav ref="ltm" noback :title="title" />
		<view class="content">
			<view class="top">
				<view class="left">
					<text v-if="grey[0] == true" class="cuIcon-roundcheckfill basecolor"></text>
					<text v-if="grey[0] == false" class="cuIcon-time"></text>
				</view>
				<view class="line" :class="{ active: grey[1] }"></view>
				<view class="center">
					<text v-if="grey[2] == true" class="cuIcon-roundcheckfill basecolor"></text>
					<text v-if="grey[2] == false" class="cuIcon-time"></text>
				</view>
				<view class="line" :class="{ active: grey[3] }"></view>
				<view class="right">
					<text v-if="grey[4] == true" class="cuIcon-roundcheckfill basecolor"></text>
					<text v-if="grey[4] == false" class="cuIcon-time"></text>
				</view>
			</view>
			<view class="body">
				<view v-if="auth_status === 3">
					<view class="text">您的资料已经审核通过，欢迎加入大卫博士</view>
					<view class="big-btn bg" @tap="join">立刻加入</view>
				</view>
				<view v-else-if="auth_status === 4">
					<view class="text">您的资料已被邀请人驳回</view>
					<view class="text">原因：<text class="basecolor">{{ reject_reason }}</text></view>
					<view class="big-btn bg" @tap="auth">重新认证</view>
				</view>
				<view v-else-if="auth_status === 5">
					<view class="text">您的资料已被上级代理驳回</view>
					<view class="text">原因：<text class="basecolor">{{ reject_reason }}</text></view>
					<view class="big-btn bg" @tap="auth">重新认证</view>
				</view>
				<view v-else class="ing">
					<image src="../../static/icon/auth-progress.png" mode=""></image>
					<text class="title">资料审核中...</text>
					<text>您的资料正在审核中，请耐心等待</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_SubAuthOver } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '审核进度',
			}
		},
		computed: {
			auth_status() { return this.$store.state.userinfo.cert_status }, // 用户认证状态
			reject_reason() { return this.$store.state.userinfo.reject_reason }, // 用户被驳回原因
			grey() {
				if (this.auth_status === 1) { // 用户认证状态为 1 表示已填写信息提交审核
					return [true, true, false, false, false]
				} else if (this.auth_status === 2) { // 用户认证状态为 2 表示邀请人已确认
					return [true, true, true, true, false]
				} else if (this.auth_status === 3) { // 用户认证状态为 3 表示上级已确认 // 认证通过
					return [true, true, true, true, true]
				} else if (this.auth_status === 4) { // 用户认证状态为 4 表示邀请人驳回
					return [true, true, false, false, false]
				} else if (this.auth_status === 5) { // 用户认证状态为 5 表示上级驳回驳回
					return [true, true, true, true, false]
				}
			}
		},
		methods: {
			join() { // 点击加入
				this.$refs.ltm.loading()
				_API_SubAuthOver().then(() => { uni.reLaunch({ url: '../index-index/index-index' }) })
			},
			auth() { // 点击重新认证
				uni.reLaunch({ url: '../auth-identity/auth-identity' })
			}
		}
	}
</script>

<style lang="scss">
	.auth-progress {
		@include page();
		.content {
			@include flex(column);
			.top {
				@include flex();
				width: 100%;
				height: 200rpx;
				background: #FFFFFF;
				align-items: flex-start;
				border-bottom: 6rpx solid #F2F2F2;
				.left, .center, .right {
					margin-top: 60rpx;
					text {
						font-size: 38rpx;
						position: relative;
					}
					text::after {
						left: 50%;
						top: 63rpx;
						font-size: 30rpx;
						position: absolute;
						white-space: nowrap;
						transform: translate(-50%);
						color: $app-main-text-color;
						
					}
				}
				.left>text::after {
					content: "提交审核";
				}
				.center>text::after {
					content: "邀请人确认";
				}
				.right>text::after {
					content: "上级审核";
				}
				.line {
					height: 2rpx;
					width: 170rpx;
					margin: 0 15rpx;
					margin-top: 79rpx;
					background: #B2B2B2;
					&.active { 
						background: $app-base-color; 
					}
				}
			}
			.body {
				@include flex();
				flex: 1;
				width: 100%;
				background: #FFFFFF;
				view {
					text-align: center;
				}
				.ing {
					@include flex(column);
					height: 100%;
					justify-content: flex-start;
					image {
						width: 356rpx;
						height: 356rpx;
						margin-top: 104rpx;
					}
					text {
						font-size: 32rpx;
						color: $app-sec-text-color;
					}
					.title {
						font-size: 46rpx;
						margin-top: 42rpx;
						color: $app-main-text-color;
					}
				}
			}
		}
	}
</style>
