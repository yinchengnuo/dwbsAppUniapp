<template>
	<view class="change-psw">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<view class="item">
				<input type="text" maxlength="12" v-mode="old" :password="show1" placeholder="请输入旧密码" />
				<text v-if="!show1" class="cuIcon-attentionfill" @tap="switchPSW(1)"></text>
				<text v-else class="cuIcon-attentionforbid" @tap="switchPSW(1)"></text>
			</view>
			<view class="item">
				<input type="text" maxlength="12" v-mode="new1" :password="show2" placeholder="请输入6-12位新密码" />
				<text v-if="!show2" class="cuIcon-attentionfill" @tap="switchPSW(2)"></text>
				<text v-else class="cuIcon-attentionforbid" @tap="switchPSW(2)"></text>
			</view>
			<view class="item">
				<input type="text" maxlength="12" v-mode="new2" :password="show3" placeholder="请再次输入6-12位新密码" />
				<text v-if="!show3" class="cuIcon-attentionfill" @tap="switchPSW(3)"></text>
				<text v-else class="cuIcon-attentionforbid" @tap="switchPSW(3)"></text>
			</view>
			<view class="big-btn bg">修改密码</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '修改密码',
				old: '',
				new1: '',
				new2: '',
				show1: true,
				show2: true,
				show3: true,
			}
		},
		methods: {
			switchPSW(index) {
				if (index === 1) {
					this.show1 = !this.show1
				} else if (index === 2) {
					this.show2 = !this.show2
				} else if (index === 3) {
					this.show3 = !this.show3
				}
			}
		}
	}
</script>

<style lang="scss">
	.change-psw {
		@include page();
		.content {
			.item {
				@include flex();
				height: 90rpx;
				width: 690rpx;
				font-size: 32rpx;
				margin: 20rpx auto;
				background: #FFFFFF;
				justify-content: flex-start;
				input {
					flex: 1;
					height: 100%;
					padding: 0 40rpx;
					box-sizing: border-box;
				}
				text {
					@include flex();
					width: 90rpx;
					height: 100%;
					font-size: 38rpx;
					&.cuIcon-attentionfill {
						color: $app-base-color;
					}
				}
			}
		}
	}
</style>
