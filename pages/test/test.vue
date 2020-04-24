<template>
	<view class="test">
		<custom-nav :title="title" />
		<view class="content">
			{{ title }}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '...开发中...'
			}
		}
	}
</script>

<style lang="scss">
	.test {
		@include page();
		.content {
			@include flex();
			font-size: 100rpx;
		}
	}
</style>
