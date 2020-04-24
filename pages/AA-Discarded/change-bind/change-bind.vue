<template>
	<view class="change-bind">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<view class="item">
				<input type="text" maxlength="11" v-mode="oldPhone" placeholder="请输入旧手机号" />
			</view>
			<view class="item">
				<input type="text" maxlength="11" v-mode="newPhone" placeholder="请输入新手机号" />
			</view>
			<view class="item">
				<input type="text" maxlength="6" v-mode="key" placeholder="请输入6位手机验证码" />
				<view class="countdown">
					发送验证码 <text v-if="countdown_num">{{ countdown_num }}</text>
				</view>
			</view>
			<view class="big-btn bg">绑定手机</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '绑定手机',
				show: true,
				countdown_num: 59,
				oldPhone: '',
				newPhone: '',
				key: ''
			}
		},
		methods: {
			switchPSW(index) {
				this.show = !this.show
			}
		}
	}
</script>

<style lang="scss">
	.change-bind {
		@include page();
		.content {
			.item {
				@include flex();
				height: 90rpx;
				width: 690rpx;
				font-size: 26rpx;
				margin: 20rpx auto;
				background: #FFFFFF;
				justify-content: flex-start;
				input {
					flex: 1;
					height: 100%;
					padding: 0 40rpx;
					box-sizing: border-box;
				}
				.countdown {
					@include flex();
					height: 56rpx;
					font-size: 24rpx;
					padding: 0 20rpx;
					background: #FFEFF0;
					margin-right: 20rpx;
					border-radius: 33rpx;
					color: $app-base-color;
					text {
						margin-left: 8rpx;
					}
				}
			}
		}
	}
</style>
