<template>
	<web-view :webview-styles="webviewStyles" :src="url"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				webviewStyles: {
					color: '#F76454'
				}
			}
		},
		onLoad(opt) {
			if (opt.url) {
				this.url = opt.url
			} else {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
</style>
