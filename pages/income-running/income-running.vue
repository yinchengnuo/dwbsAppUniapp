<template>
	<view class="income-running">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="data-card">
				<image src="../../static/icon/data-card.png" class="position-center"></image>
				<view class="data-card-text position-center">
					<text class="text">累计业绩(元)</text>
					<text class="num">{{ all_income | numDot }}元</text>
				</view>
			</view>
			<view class="title">收入明细</view>
			<view class="scroll">
				<pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="pulldownrefresh">
					<scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }" @scrolltolower="scrolltolower">
						<view class="item" v-for="(item, index) in list" :key="index">
							<view class="left">
								<text class="name">{{ item.type | getType }}</text>
								<text class="time">{{ item.created_at }}</text>
							</view>
							<view class="right">+{{ item.money | numDot }}.00</view>
						</view>
						<custom-reach-bottom v-if="list.length" :nomore="page === 0" />
						<swiper-status v-else :page="page" unit="流水" />
					</scroll-view>
				</pulldown-refresher>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_FortuneIncomeList } from '@/apis/fortune.js'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	export default {
		components: { swiperStatus, pulldownRefresher, customReachBottom },
		data() {
			return {
				title: '收入流水',
				all_income: 0,
				list: [],
				page: 1,
				scrollViewHeight: 0,
				requesting: false
			}
		},
		filters: {
			getType(val) {
				switch (+val) {
					case 0 : {
						return '下级代理下单收入'
					}
					case 1 : {
						return '零售收入'
					}
					case 2 : {
						return '邀请奖励收入'
					}
					case 3 : {
						return '店铺奖励收入'
					}
					case 4 : {
						return '业绩奖励收入'
					}
				}
			}
		},
		mounted() {
			this.request()
			this.$offset('.scroll').then(res => {
				this.scrollViewHeight = res.height
			})
		},
		methods: {
			request(action) {
				return new Promise(resolve => { // 只有在 首次加载列表或者下拉刷新时才显示 liaoding
					if (this.page) { // 当上一批数量不小于 size 时执行
						!action && this.$refs.ltm.loading() // 开始 loading, 只有在 首次加载列表或者下拉刷新时才显示 liaoding
						this.requesting = true // 请求加锁防抖
						_API_FortuneIncomeList({ page: this.page }).then(res => {
							!action ? this.list = [] : '' // 如果是下拉刷新，清空列表
							this.list = [...this.list, ...res.data.list]
							this.all_income = res.data.all_money // 获取总收入
							res.data.list.length < +res.data.size ? this.page = 0 : this.page ++ // 如果返回列表数量小于 10 表示没有更多了
						}).catch(() => { // 网络请求失败 进入失败状态
							this.page = -1
							this.list = []
						}).finally(() => { // promise 结束
							resolve() // 通知下拉刷新收起
							this.requesting = false // 取消请求加锁防抖
						})
					}
				})
			},
			pulldownrefresh() { // 下拉刷新
				this.page = 1
				this.request().then(() => { this.$refs.pulldownRefresher.pullup() })
			},
			scrolltolower() { // 上拉加载
				this.requesting ? '' : this.request('loadmore')
			}
		}
	}
</script>

<style lang="scss">
	.income-running {
		@include page();
		.content {
			@include flex(column);
			.type {
				@include flex();
				width: 100%;
				height: 120rpx;
				font-size: 32rpx;
				background: #FFFFFF;
				padding: 20rpx 30rpx;
				box-sizing: border-box;
				text {
					@include flex();
					flex: 1;
					height: 100%;
				}
			}
			.title {
				@include flex();
				width: 100%;
				height: 60rpx;
				font-size: 32rpx;
				padding: 0 30rpx;
				background: #FFFFFF;
				margin: 10rpx 0 1rpx;
				box-sizing: border-box;
				justify-content: flex-start;
			}
			.scroll {
				flex: 1;
				width: 100%;
				background: #FFFFFF;
				scroll-view {
					.item {
						@include flex();
						height: 90rpx;
						background: #FFFFFF;
						padding: 10rpx 30rpx;
						box-sizing: border-box;
						justify-content: space-between;
						border-bottom: 1rpx solid $app-base-bg;
						.left {
							@include flex(column);
							flex: 1;
							height: 100%;
							align-items: flex-start;
							.name {
								font-size: 26rpx;
							}
							.time {
								font-size: 24rpx;
								color: $app-sec-text-color;
							}
						}
						.right {
							font-size: 30rpx;
							color: $app-base-color;
						}
					}
				}
			}
		}
	}
</style>
