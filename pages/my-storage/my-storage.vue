<template>
	<view class="test">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="swiper-nav">
				<view v-for="(item, index) in list" :key="index" class="item" :class="{ active: MIXIN_ActiveIndex === index }" @tap="switchSwiper(index)">{{ item.name }}</view>
				<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: 100 / list.length + '%' }"><text></text></view>
			</view>
			<view class="swiper-area">
				<swiper class="swiper" :current="MIXIN_ActiveIndex" :duration="234" @change="MIXIN_change">
					<swiper-item v-for="(item, index) in list" :key="index">
						<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }">
							<view class="item">
								<view class="name-avatar">
									<image class="img" :src="item.img" ></image>
									<text>{{ item.name }}</text>
								</view>
								<view class="app-item item-space">
									<text>单品价</text>
									<text class="basecolor">￥{{ item.price }}.00</text>
								</view>
								<view class="app-item">
									<text>总库存剩余</text>
									<text class="basecolor">{{ item | totalNumStorage }}件</text>
								</view>
								<view class="app-item">
									<text>总库存价值</text>
									<text class="basecolor">￥{{ item | totalValueStorage | numDot }}</text>
								</view>
								<view class="app-item item-space type">
									<text>商品类型</text>
								</view>
								<view class="app-item" >
									<text>总库存价值</text>
									<text class="basecolor">￥{{ item | totalValueStorage | numDot }}</text>
								</view>
								<view class="app-item" v-for="(typeItem, typeIndex) in item.typeList" :key="typeIndex" v-if="typeNum(typeItem)">
									<text>{{ typeItem.name }}</text>
									<text class="basecolor">{{ typeNum(typeItem) + ' ' }}件</text>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_OrderStorage } from '@/apis/order.js'
	export default {
		data() {
			return {
				title: '我的库存',
				list: [0, 0, 0],
				MIXIN_ActiveIndex: 0,
				MIXIN_MoveBarLeft: 0,
				MIXIN_ScrollViewHeight: 0,
				MIXIN_ScreenWidth: this.$store.state.device.screenWidth, // 屏幕宽
			}
		},
		computed: {
			typeNum(typeItem) {
				return typeItem => typeItem.num.reduce((t, e) => t + (+e), 0)
			}
		},
		filters: {
			totalNumStorage(val) {
				return val.typeList.reduce((t, e) => e.num.reduce((tt, ee) => tt + Number(ee), t), 0)
			},
			totalValueStorage(val) {
				return val.typeList.reduce((t, e) => e.num.reduce((tt, ee) => tt + Number(ee), t), 0) * (+val.price)
			}
		},
		mounted() {
			this.$refs.ltm.loading()
			_API_OrderStorage().then(res => {
				console.log(JSON.stringify(res.data.list), 666)
				this.list = res.data.list
				this.$nextTick(() => this.$offset('.swiper').then(res => { this.MIXIN_ScrollViewHeight = res.height })) // 设置scrollview 高)
			})
		},
		methods: {
			MIXIN_change({ detail: { current } }) {
				this.MIXIN_ActiveIndex = current
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / this.list.length)
			},
			switchSwiper(index) { // 点击导航栏切换
				this.MIXIN_ActiveIndex = index
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / this.list.length)
			}
		}
	}
</script>

<style lang="scss">
	.test {
		@include page();
		.content {
			@include flex(column);
			.swiper-nav {
				height: auto;
				min-height: 84rpx;
				margin-bottom: 1rpx;
				.item {
					text-align: center;
					box-sizing: border-box;
					border: 10rpx solid #FFFFFF;
				}
				text {
					width: 56rpx;
				}
			}
			.swiper-area {
				flex: 1;
				width: 100%;
				.swiper {
					height: 100%;
					scroll-view {
						.item {
							.name-avatar {
								@include flex();
								height: 180rpx;
								font-size: 32rpx;
								margin-top: 10rpx;
								background: #FFFFFF;
								padding: 20rpx 30rpx;
								box-sizing: border-box;
								justify-content: flex-start;
								.img {
									width: 140rpx;
									height: 140rpx;
									margin-right: 40rpx;
								}
							}
							.type {
								height: 30rpx;
								font-size: 26rpx;
							}
							
						}
					}
				}
			}
		}
	}
</style>
