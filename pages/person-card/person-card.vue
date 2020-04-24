<template>
	<view class="test">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="top-bg">
				<image :src="info.avatar" mode="widthFix"></image>
			</view>
			<view class="info">
				<image class="avatar" :src="info.avatar"></image>
				<view class="nickname">{{ info.nickname || '' }}</view>
				<view class="realname">
					<text class="left">真实姓名</text>
					<text class="right">{{ info.real_name || '' }}</text>
				</view>
				<view class="phone">
					<text class="left">联系方式</text>
					<text class="right">{{ info.mobile }}</text>
				</view>
			</view>
			<view class="level-info">
				<view class="level-items" :class="{ open: open }">
					<view class="level-item">
						<text class="left">代理级别</text>
						<text class="right">{{ info.level }}</text>
					</view>
					<view class="level-item">
						<text class="left">邀请人</text>
						<text class="right">{{ info.recom_nickname }}</text>
					</view>
					<view class="level-item">
						<text class="left">上级代理</text>
						<text class="right">{{ info.up_nickname || '' }}</text>
					</view>
				</view>
				<view class="level-lock basecolor" @tap="toogle">{{ open ? '收起' : '显示更多' }}</view>
			</view>
			<view class="team-info">
				<view @tap="toAuthCard">
					<text class="left">授权书</text>
					<text class="cuIcon-right"></text>
				</view>
				<view>
					<text class="left">团队人数</text>
					<text class="right">{{ info.team_num || '0' }}人</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_TeamPerData } from '@/apis/team.js'
	export default {
		data() {
			return {
				title: '个人名片',
				info: {},
				open: false
			}
		},
		onLoad(opt) {
			if (opt.self) { // 如果是用户查看自己的命片
				this.title = '我的名片'
			}
			this.$refs.ltm.loading()
			_API_TeamPerData({ id: opt.id }).then(res => {
				this.info = res.data
				if (this.title !== '我的名片') {
					if (this.info.real_name) {
						this.info.real_name = this.info.real_name.replace(/./g, '*').replace(/^\*/, this.info.real_name[0])
					} else {
						this.info.real_name = '***'
					}
				}
			})
		},
		methods: {
			toogle() {
				this.open = !this.open
			},
			toAuthCard() {
				uni.navigateTo({ url: '../auth-card/auth-card' })
			}
		}
	}
</script>

<style lang="scss">
	.test {
		@include page();
		.content {
			.top-bg {
				height: 300rpx;
				overflow: hidden;
				filter: blur(8rpx);
				image {
					width: 100%;
					transform: translateY(-25%);
				}
			}
			.info {
				@include flex(column);
				height: 270rpx;
				font-size: 26rpx;
				position: relative;
				background: #FFFFFF;
				justify-content: flex-end;
				border-bottom: 1rpx solid $app-base-bg;
				.avatar {
					top: 0;
					left: 50%;
					width: 108rpx;
					height: 108rpx;
					position: absolute;
					border-radius: 8rpx;
					transform: translate(-50%, -50%);
				}
				>view {
					@include flex();
					width: 100%;
					padding: 0 30rpx;
					line-height: 72rpx;
					box-sizing: border-box;
					justify-content: flex-start;
					&.nickname {
						margin-bottom: 12rpx;
						justify-content: center;
					}
					.left {
						width: 300rpx;
					}
				}
			}
			.level-info {
				background: #FFFFFF;
				margin-bottom: 20rpx;
				.level-items {
					height: 0;
					overflow: hidden;
					&.open {
						height: 270rpx;
					}
					>view {
						@include flex();
						width: 100%;
						height: 90rpx;
						padding: 0 30rpx;
						box-sizing: border-box;
						justify-content: flex-start;
						border-bottom: 1rpx solid $app-base-bg;
						.left {
							width: 300rpx;
						}
					}
				}
				.level-lock {
					@include flex();
					height: 60rpx;
				}
			}
			.team-info {
				>view {
					@include flex();
					width: 100%;
					height: 90rpx;
					padding: 0 30rpx;
					font-size: 32rpx;
					background: #FFFFFF;
					box-sizing: border-box;
					justify-content: space-between;
					border-bottom: 1rpx solid $app-base-bg;
					.left {
						width: 300rpx;
					}
				}
			}
		}
	}
</style>
