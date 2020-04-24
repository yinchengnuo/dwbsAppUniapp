<template>
	<view class="help-use">
		<custom-nav :title="title" />
		<view class="content">
			<image src="../../static/icon/howuse.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '如何使用'
			}
		},
	}
</script>

<style lang="scss">
	.help-use {
		@include flex();
		.content {
			image {
				width: 750rpx;
				height: 7322rpx;
			}
		}
	}
</style>
