<template>
	<view class="index">
		<index-my />
		<index-data />
		<index-index />
		<index-commu />
		<index-tabbar />
	</view>
</template>

<script>
	import indexMy from '../../components/index/index-my.vue'
	import indexData from '../../components/index/index-data.vue'
	import indexCommu from '../../components/index/index-commu.vue'
	import indexIndex from '../../components/index/index-index.vue'
	import indexTabbar from '../../components/index/index-tabbar.vue'
	export default {
		components: {
			indexMy,
			indexData,
			indexIndex,
			indexCommu,
			indexTabbar
		},
		computed: {
			activeIndex() {
				return this.$store.state.app.index_tabbar_index
			}
		},
		watch: { // 监听首页 tabbar 变化，适时开启下拉刷新
			activeIndex: {
				handler(val) {
					if (val === 0) {
						this.setPullDown()
					} else {
						uni.stopPullDownRefresh()
						this.offPullDown()
					}
				},
				immediate: true
			}
		},
		methods: {
			setPullDown() {
				getCurrentPages()[getCurrentPages().length - 1].$getAppWebview().setStyle({
					"pullToRefresh": {
						support: true,
						offset: "23%",
						style: "circle",
						color: "#F76454"
					}
				})
			},
			offPullDown() {
				getCurrentPages()[getCurrentPages().length - 1].$getAppWebview().setStyle({ pullToRefresh: { support: false } })
			}
		},
		onPullDownRefresh() {
			uni.$emit('INDEXPULLDOWNREFRESH' + this.activeIndex)
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		height: 100%;
	}
</style>
