<template>
	<view class="manage-money">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="chart">
				<view class="switch">
					<text :class="{ active: active === 7 }" @tap="switchChart(7)">7日</text>
					<text :class="{ active: active === 15 }" @tap="switchChart(15)">15日</text>
					<text :class="{ active: active === 30 }" @tap="switchChart(30)">30日</text>
				</view>
				<view class="chart-line">
					<chart-line :chartData="chartData" color="#A213C8" background="#F4E4F9" unit="元" />
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
	import { _API_FortuneChart } from '@/apis/fortune.js'
	import chartLine from '@/components/charts/chart-line.vue'
	export default {
		components: {
			chartLine
		},
		data() {
			return {
				title: '财富管理',
				chartData: {},
				active: 15,
				operationList: [
					{
						name: '收入流水',
						url: '../../pages/income-running/income-running',
						image: '../../static/index/index/income-running.png'
					},
					{
						name: '奖励支出',
						url: '../../pages/reward-out/reward-out',
						image: '../../static/index/index/reward-out.png'
					},
					{
						name: '奖励收入',
						url: '../../pages/reward-in/reward-in',
						image: '../../static/index/index/reward-in.png'
					},
					{
						name: '零售录单',
						url: '../../pages/record-order/record-order',
						image: '../../static/index/index/income-shop.png'
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
				uni.startPullDownRefresh()
			},
			request() { // 网络请求方法
				this.$refs.ltm.loading()
				_API_FortuneChart({ day: this.active }).then(res => {
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
	.manage-money {
		@include page();
		.content {
			background: #FFFFFF;
			.chart {
				@include flex(column);
				height: 720rpx;
				background: #F4E4F9;
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
					padding: 0 10rpx;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
