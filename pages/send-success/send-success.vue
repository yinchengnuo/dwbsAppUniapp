<template>
	<view class="test">
		<custom-nav :title="title" />
		<view class="content">
			<image class="ok" src="../../static/icon/ok.png"></image>
			<view class="title">{{ title }}</view>
			<view v-if="numTotal > 1" class="big-btn bg" @tap="goonSend">继续发货</view>
			<view class="big-btn back" @tap="backToIndex">返回首页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '发货成功',
				numTotal: 0,
			}
		},
		onLoad(opt) {
			if (opt.type === '2') {
				this.title = '转单成功'
			}
			this.numTotal = +opt.numTotal
		},
		methods: {
			backToIndex() { // 点击回到首页
				uni.navigateBack({ delta: 123 })
			},
			goonSend() { // 点击继续发货
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.test {
		@include page();
		.content {
			@include flex(column);
			height: 100%;
			background: #FFFFFF;
			padding-top: 120rpx;
			box-sizing: border-box;
			justify-content: flex-start;
			.ok {
				width: 228rpx;
				height: 228rpx;
			}
			.title {
				font-size: 50rpx;
				margin: 59rpx 0 126rpx;
			}
			.big-btn {
				width: 480rpx;
				&.back {
					margin-top: 30rpx;
				}
			}
		}
	}
</style>
