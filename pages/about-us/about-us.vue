<template>
	<view class="about-us">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<image src="../../static/appicon/logo.png"></image>
			<view class="version">
				<text>版本信息</text>
				<text>{{ version }}</text>
			</view>
			<view class="name">— 郑州久卫云科技公司 —</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '关于我们'
			}
		},
		computed: {
			version() { return this.$store.state.app.version }
		}
	}
</script>

<style lang="scss">
	.about-us {
		@include page();
		.content {
			image {
				width: 160rpx;
				height: 160rpx;
				display: block;
				margin: 70rpx auto 60rpx;
			}
			.version {
				@include flex();
				height: 90rpx;
				padding: 0 30rpx;
				font-size: 32rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				justify-content: space-between;
			}
			.name {
				left: 0;
				right: 0;
				bottom: 40rpx;
				position: fixed;
				font-size: 26rpx;
				text-align: center;
			}
		}
	}
</style>
