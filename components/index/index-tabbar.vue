<template>
	<view class="index-tabbar">
		<view class="item" v-for="(item, index) in list" :key="index" @tap="switchTabbar(index)" @longpress="longpress(index)" @touchend="touchend(index)">
			<view class="hover" :class="index === activeIndex ? 'active' : ''"></view>
			<image v-if="tabbarIndex === index" :src="item.icon_act"></image>
			<image v-else :src="item.icon"></image>
			<text :class="tabbarIndex === index ? 'active' : ''">{{ item.name }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: -1,
				list: [
					{
						name: '首页',
						icon: '../../static/index/tabbar/index.png',
						icon_act: '../../static/index/tabbar/index-act.png'
					},
					{
						name: '数据',
						icon: '../../static/index/tabbar/data.png',
						icon_act: '../../static/index/tabbar/data-act.png'
					},
					{
						name: '社区',
						icon: '../../static/index/tabbar/community.png',
						icon_act: '../../static/index/tabbar/community-act.png'
					},
					{
						name: '我的',
						icon: '../../static/index/tabbar/my.png',
						icon_act: '../../static/index/tabbar/my-act.png'
					},
				]
			}
		},
		computed: {
			tabbarIndex() { return this.$store.state.app.index_tabbar_index }
		},
		methods: {
			switchTabbar(index) {
				this.$store.commit('app/SWITCHINDEXTAABARINDEX', index)
				this.activeIndex = index
				setTimeout(() => {
					this.activeIndex = -1
				}, 400)
			},
			longpress(index) {
				this.activeIndex = index
			},
			touchend(index) {
				this.activeIndex = -1
				this.$store.commit('app/SWITCHINDEXTAABARINDEX', index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-tabbar {
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		position: fixed;
		background: #FFFFFF;
		align-items: center;
		box-sizing: border-box;
		border-top: 1rpx solid #B2B2B2;
		height: $app-tabbar-height;
		justify-content: space-around;
		.item {
			flex: 1;
			height: 100%;
			display: flex;
			overflow: hidden;
			position: relative;
			align-items: center;
			flex-direction: column;
			.hover {
				top: 50%;
				width: 0;
				height: 0;
				left: 50%;
				z-index: 1;
				position: absolute;
				border-radius: 60rpx;
				background: rgba(1, 1, 1, .1);
				transform: translate(-50%, -50%);
				&.active {
					animation: tap-in .3s;
					animation-fill-mode: forwards;
				}
			}
			text {
				color: #666666;
				font-size: 22rpx;
				&.active {
					color: $app-base-color;
				}
			}
			image {
				width: 38rpx;
				height: 38rpx;
				margin: 16rpx 0 8rpx;
			}
		}
	}
	@keyframes tap-in {
		0% {
			width: 0;
			height: 0;
		}
		100% {
			width: 120%;
			height: 120%;
		}
	}
</style>
