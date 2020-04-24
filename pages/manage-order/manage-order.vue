<template>
	<view class="manage-order">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="chart">
				<view class="switch">
					<text :class="{ active: active === 7 }" @tap="switchChart(7)">7日</text>
					<text :class="{ active: active === 15 }" @tap="switchChart(15)">15日</text>
					<text :class="{ active: active === 30 }" @tap="switchChart(30)">30日</text>
				</view>
				<view class="chart-line">
					<chart-line :chartData="chartData" color="#078EC6" background="#E4F4FA" unit="单" />
				</view>
			</view>
			<view class="kingkong">
				<navigator v-for="(item, index) in operationList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_OrderChart } from '@/apis/order.js'
	import chartLine from '@/components/charts/chart-line.vue'
	export default {
		components: {
			chartLine
		},
		data() {
			return {
				title: '订单管理',
				chartData: {},
				active: 15,
				operationList: [
					{
						name: '订货下单',
						url: '../../pages/place-order/place-order',
						image: '../../static/index/index/place-order.png'
					},
					{
						name: '我的订单',
						url: '../../pages/my-order/my-order',
						image: '../../static/index/index/my-order.png'
					},
					{
						name: '下级订单',
						url: '../../pages/down-order/down-order',
						image: '../../static/index/index/down-order.png'
					},
					{
						name: '我的库存',
						url: '../../pages/my-storage/my-storage',
						image: '../../static/index/index/my-stock.png'
					}
				]
			}
		},
		created() {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			this.request()
		},
		methods: {
			switchChart(active) {
				this.active = active
				this.request()
			},
			request() { // 网络请求方法
				this.$refs.ltm.loading()
				uni.startPullDownRefresh()
				_API_OrderChart({ day: this.active }).then(res => {
					const data = { categories: [], series: [{ data: [] }] }
					data.categories = res.data.date
					data.series[0].data = res.data.data
					this.chartData = data
				}).catch(() => {
					this.$refs.ltm.toast('网络崩溃了，请下拉刷试试')
				}).finally(() => uni.stopPullDownRefresh())
			}
		}
	}
</script>

<style lang="scss">
	.manage-order{
		@include page();
		.content {
			background: #FFFFFF;
			.chart {
				@include flex(column);
				height: 720rpx;
				background: #E4F4FA;
				.switch {
					@include  flex();
					width: 100%;
					height: 110rpx;
					text {
						@include flex();
						height: 46rpx;
						width: 100rpx;
						font-size: 28rpx;
						border-radius: 23rpx;
						color: $app-base-color;
						border: 2rpx solid $app-base-color;
						&.active {
							color: #FFFFFF;
							background: $app-base-color;
						}
					}
					text:nth-child(2) {
						margin: 0 55rpx;
					}
				}
				.chart-line {
					flex: 1;
					width: 100%;
					box-sizing: border-box;
					padding: 0 10rpx;
				}
			}
		}
	}
</style>
