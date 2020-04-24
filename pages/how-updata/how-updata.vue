<template>
	<view class="how-updata">
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
				title: '如何升级'
			}
		}
	}
</script>

<style lang="scss">
	.how-updata {
		@include page();
		.content {
			@include flex();
			font-size: 100rpx;
		}
	}
</style>
