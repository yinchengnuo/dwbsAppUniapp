<template>
	<view class="index-data" :style="{ display: SHOW ? 'flex' : 'none' }">
		<custom-nav :title="title" noback></custom-nav>
		<veiw v-if="logged" class="content">
			<view class="total">
				<image src="../../static/icon/data-card.png" class="position-center"></image>
				<view class="total-text position-center">
					<text class="text">累计业绩(元)</text>
					<text class="num">35,000元</text>
				</view>
			</view>
			<view class="storage">
				<view class="storage-item">
					<text class="storage-text">200件</text>
					<text class="storage-num">我的库存</text>
				</view>
				<view class="line"></view>
				<view class="storage-item">
					<text class="storage-text">100件</text>
					<text class="storage-num">下级库存</text>
				</view>
			</view>
			<view class="income">
				<view class="nav">
					<text class="nav-text">本月营收情况</text>
					<text class="nav-more">
						<text class="more">更多</text>
						<text class="cuIcon-right"></text>
					</text>
				</view>
				<view class="data">
					<view class="chart">
						<chart-progress :chartData="chartData" width="210" height="210" title="总业绩" :value="'2000元'" />
					</view>
					<view class="data-nums">
						<view class="data-item">
							<text class="data-text">本月业绩</text>
							<text class="data-num">2,000元</text>
						</view>
						<view class="data-item">
							<text class="data-text">本月业绩</text>
							<text class="data-num">2,000元</text>
						</view>
						<view class="data-item">
							<text class="data-text">本月业绩</text>
							<text class="data-num">2,000元</text>
						</view>
						<view class="data-item">
							<text class="data-text">本月业绩</text>
							<text class="data-num">2,000元</text>
						</view>
					</view>
				</view>
			</view>
			<view class="team">
				<view class="nav">
					<text class="nav-text">本月新增团队成员</text>
					<text class="nav-more">
						<text class="more">更多</text>
						<text class="cuIcon-right"></text>
					</text>
				</view>
				<view class="data">
					<view class="chart">
						<chart-progress :chartData="chartData" width="210" height="210" title="总人数" :value="'20人'" />
					</view>
					<view class="data-nums">
						<view class="data-item">
							<text class="data-text">新增总数</text>
							<text class="data-num">20人</text>
						</view>
						<view class="data-item">
							<text class="data-text">特级代理</text>
							<text class="data-num">20人</text>
						</view>
						<view class="data-item">
							<text class="data-text">顶级代理</text>
							<text class="data-num">20人</text>
						</view>
						<view class="data-item">
							<text class="data-text">直属下级</text>
							<text class="data-num">20人</text>
						</view>
					</view>
				</view>
			</view>
			<view class="rank"></view>
			<view class="tabbar"></view>
		</veiw>
		<view v-else class="login-btn">
			<navigator url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import chartProgress from '../charts/chart-progress.vue'
	export default {
		components: {
			chartProgress
		},
		data() {
			return {
				title: '数据',
				chartData: {
					series: [
						{
							name: '正确率',
							data: 0.29,
							color: '#F76454'
						}
					]
				}
			}
		},
		computed: {
			SHOW(){ return this.$store.state.app.index_tabbar_index === 1 },
			logged() { return this.$store.state.app.token.length === 0 ? false : true }
		},
		watch: {
			SHOW: {
				handler(val) {
					if (val) {}
				},
				immediate: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-data {
		@include page();
		.content {
			.total {
				@include flex();
				height: 336rpx;
				position: relative;
				background: $app-base-bg;
				image {
					z-index: 0;
					width: 706rpx;
					height: 316rpx;
				}
				.total-text {
					@include flex(column);
					.text {
						color: #FFFFFF;
						font-size: 32rpx;
					}
					.num {
						color: #FFFFFF;
						font-size: 70rpx;
						margin-top: 60rpx;
					}
				}
			}
			.storage {
				height: 160rpx;
				background: #FFFFFF;
				@include flex();
				justify-content: space-between;
				.storage-item {
					@include flex(column);
					flex: 1;
					height: 100%;
					.storage-text {
						font-size: 32rpx;
						color: $app-base-color;
					}
					.storage-num {
						font-size: 26rpx;
						margin-top: 20rpx;
					}
				}
				.line {
					width: 1rpx;
					height: 100rpx;
					background: #F2F2F2;
				}
			}
			.income, .team {
				height: 360rpx;
				background: #FFFFFF;
				border-top: 10rpx solid $app-base-bg;
				.nav {
					@include flex();
					height: 90rpx;
					padding: 0 30rpx;
					font-size: 32rpx;
					box-sizing: border-box;
					justify-content: space-between;
					border-bottom: 1rpx solid $app-base-bg;
					.nav-more {
						color: $app-sec-text-color;
						.more {
							font-size: 26rpx;
							margin-right: 8rpx;
						}
					}
				}
				.data {
					@include flex();
					height: 270rpx;
					padding: 30rpx 60rpx;
					box-sizing: border-box;
					justify-content: space-between;
					.chart {
						height: 100%;
						width: 210rpx;
					}
					.data-nums {
						@include flex(column);
						height: 100%;
						width: 280rpx;
						.data-item {
							@include flex();
							flex: 1;
							width: 100%;
							font-size: 26rpx;
							justify-content: space-between;
							.data-num {
								color: $app-base-color;
							}
						}
					}
				}
			}
			.rank {
				height: 360rpx;
				background: #FFFFFF;
				border-top: 10rpx solid $app-base-bg;
			}
			.tabbar {
				height: $app-tabbar-height;
			}
		}
	}
</style>
