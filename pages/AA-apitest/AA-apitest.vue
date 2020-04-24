<template>
	<view class="AA-apitest">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '测试页面'
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.AA-apitest {
		@include page();
		.content {
			@include flex();
			font-size: 100rpx;
		}
	}
</style>
