<template>
	<view class="reward-in">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="data-card">
				<image src="../../static/icon/data-card.png" class="position-center"></image>
				<view class="data-card-text position-center">
					<text class="text">累计业绩(元)</text>
					<text class="num">{{ all_money | numDot }}元</text>
				</view>
			</view>
			<view class="data-chart">
				<view class="data-date">
					<picker mode="date" :value="date" start="2015-09-01" :end="end" @change="DateChange">
						<view class="picker">{{ date + ' >' }}</view>
					</picker>
				</view>
				<view class="chart">
					<view class="chart-wrapper">
						<view class="value position-center">
							<view class="title">收入金额（元）</view>
							<view class="value">{{ money }}.00</view>
						</view>
						<chart-progress :chartData="chartData" width="320" height="320" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_FortuneReward } from '@/apis/fortune.js'
	import chartProgress from '@/components/charts/chart-progress.vue'
	export default {
		components: { chartProgress },
		data() {
			return {
				title: '奖励收入',
				end: this.$options.filters.getYear(+new Date()) + '-' + this.$options.filters.getMonth(+new Date()) + '-' + this.$options.filters.getDate(+new Date()),
				date: this.$options.filters.getYear(+new Date()) + '-' + this.$options.filters.getMonth(+new Date()) + '-' + this.$options.filters.getDate(+new Date()),
				money: 0,
				all_money: 0
			}
		},
		computed: {
			chartData() {
				return {
					series: [
						{
							name: '奖励收入',
							data: this.money / this.all_money,
							color: '#F76454'
						}
					]
				}
			}
		},
		mounted() {
			this.request(new Date(this.date) / 1000) // 请求数据
		},
		methods: {
			DateChange(e) {
				if(this.date !== e.detail.value) { // 当选择的日期不等于今天时再请求数据
					this.request(+ new Date(e.detail.value) / 1000).then(() => this.date = e.detail.value) // 请求数据
				}
			},
			request(time) { // 请求数据方法
				return new Promise(resolve => {
					this.$refs.ltm.loading()
					_API_FortuneReward({ type: 0, time }).then(res => {
						resolve()
						this.money = res.data.money
						this.all_money = res.data.all_money
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.reward-in {
		@include page();
		.content {
			@include flex(column);
			.data-chart {
				flex: 1;
				width: 100%;
				@include flex(column);
				justify-content: flex-start;
				.data-date {
					@include flex();
					width: 100%;
					height: 76rpx;
					font-size: 32rpx;
					margin-bottom: 1rpx;
					background: #FFFFFF;
					letter-spacing: 4rpx;
				}
				.chart {
					@include flex();
					width: 100%;
					height: 423rpx;
					background: #FFFFFF;
					.chart-wrapper {
						width: 320rpx;
						height: 320rpx;
						overflow: hidden;
						position: relative;
						.value {
							width: 100%;
							z-index: 9999;
							text-align: center;
							.title {
								font-size: 26rpx;
							}
							.value {
								font-size: 50rpx;
								margin-top: 26rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
