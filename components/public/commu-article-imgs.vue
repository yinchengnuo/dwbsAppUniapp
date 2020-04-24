<template>
	<view class="commu-article-imgs">
		<image v-for="item in imgs" :key="item" :src="item"></image>
	</view>
</template>

<script>
	export default {
		props: {
			article: String
		},
		computed: {
			imgs() {
				const imgs = []
				this.article.match(/img src=".+"/g).forEach(e => {
					imgs.push(e.replace('img src="', '').replace('"', ''))
				})
				return imgs.slice(0, 3)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.commu-article-imgs {
		@include flex();
		width: 100%;
		justify-content: space-between;
		image {
			width: 222rpx;
			height: 150rpx;
			margin-top: 10rpx;
			border-radius: 10rpx;
		}
	}
</style>
