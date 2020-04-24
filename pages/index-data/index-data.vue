<template>
	<view class="index-data">
		<custom-nav :title="title" noback></custom-nav>
		<veiw v-if="logged" class="content">
			<view class="data-card">
				<image src="../../static/icon/data-card.png" class="position-center"></image>
				<view class="data-card-text position-center">
					<text class="text">累计业绩(元)</text>
					<text class="num">{{ total_income | numDot }}元</text>
				</view>
			</view>
			<view class="storage">
				<view class="storage-item">
					<text class="storage-text">{{ my_storage | numDot }}件</text>
					<text class="storage-num">我的库存</text>
				</view>
				<view class="line"></view>
				<view class="storage-item">
					<text class="storage-text">{{ down_storage | numDot }}件</text>
					<text class="storage-num">下级库存</text>
				</view>
			</view>
			<view class="income">
				<view class="nav">
					<text class="nav-text">本月营收情况</text>
					<navigator class="nav-more" url="../income-running/income-running">
						<text class="more">更多</text>
						<text class="cuIcon-right"></text>
					</navigator>
				</view>
				<view class="data">
					<view class="chart">
						<chart-progress :chartData="moneyChartData" width="210" height="210" title="总业绩" :value="total_income + '元'" />
					</view>
					<view class="data-nums">
						<view class="data-item">
							<text class="data-text">本月业绩</text>
							<text class="data-num">{{ month_income | numDot }}元</text>
						</view>
						<view class="data-item">
							<text class="data-text">本月收款</text>
							<text class="data-num">{{ month_order_income | numDot }}元</text>
						</view>
						<view class="data-item">
							<text class="data-text">本月零售</text>
							<text class="data-num">{{ month_sold_income | numDot }}元</text>
						</view>
					</view>
				</view>
			</view>
			<view class="team">
				<view class="nav">
					<text class="nav-text">本月新增团队成员</text>
					<navigator class="nav-more" url="../team-manage/team-manage">
						<text class="more">更多</text>
						<text class="cuIcon-right"></text>
					</navigator>
				</view>
				<view class="data">
					<view class="chart">
						<chart-progress :chartData="teamChartData" width="210" height="210" title="总人数" :value="total_team_num + '人'" />
					</view>
					<view class="data-nums">
						<view class="data-item">
							<text class="data-text">新增总数</text>
							<text class="data-num">{{ month_team_num | numDot }}人</text>
						</view>
						<view class="data-item">
							<text class="data-text">特级代理</text>
							<text class="data-num">{{ month_super_num | numDot }}人</text>
						</view>
						<view class="data-item">
							<text class="data-text">顶级代理</text>
							<text class="data-num">{{ month_top_num | numDot }}人</text>
						</view>
						<view class="data-item">
							<text class="data-text">直属下级</text>
							<text class="data-num">{{ month_direct_num | numDot }}人</text>
						</view>
					</view>
				</view>
			</view>
			<view class="rank" v-if="team_rank.length">
				<view class="nav">
					<text class="nav-text">本月团队个人业绩排行榜</text>
					<navigator class="nav-more" url="../team-achievement/team-achievement">
						<text class="more">更多</text>
						<text class="cuIcon-right"></text>
					</navigator>
				</view>
				<view class="team-rank-item" v-for="(item, index) in team_rank" :key="index">
					<image :src="item.avatar"></image>
					<text class="user_name">{{ item.nickname }}</text>
					<text class="level_name"><text class="levelname"><text class="cuIcon-crownfill"></text>{{ item.level }}</text></text>
					<text class="moneyNum">{{ item.money }}元</text>
				</view>
			</view>
		</veiw>
		<view v-else class="login-btn" style="height: 100%;">
			<navigator open-type="reLaunch" url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import { _API_IndexData } from '@/apis/app.js'
	import chartProgress from '@/components/charts/chart-progress.vue'
	export default {
		components: {
			chartProgress
		},
		data() {
			return {
				title: '数据',
				total_income: 0, // 累计业绩
				my_storage: 0, // 我的库存
				down_storage: 0, // 下级库存
				month_income: 0, // 本月业绩
				month_order_income: 0, // 本月收款
				month_sold_income: 0, // 本月零售
				total_team_num: 0, // 团队总人数
				month_team_num: 0, // 本月新增人数
				month_super_num: 0, // 本月新增特级代理人数
				month_top_num: 0, // 本月新增顶级代理人数
				month_direct_num: 0, // 本月新增直属代理人数
				team_rank: []
			}
		},
		computed: {
			logged() { return this.$store.state.app.token ? true : false},
			moneyChartData () {
				return {
					series: [
						{
							name: '本月新增业绩人数占比总业绩',
							data: this.month_team_num / this.total_income,
							color: '#F76454'
						}
					]
				}
			},
			teamChartData () {
				return {
					series: [
						{
							name: '本月新增团队人数占比总团队人数',
							data: this.month_income / this.total_team_num,
							color: '#F76454'
						}
					]
				}
			},
		},
		created() {
			if (this.logged) {
				uni.startPullDownRefresh()
			}
		},
		onPullDownRefresh() {
			this.getData()
		},
		methods: {
			getData() {
				_API_IndexData().then(res => {
					this.total_income = res.data.total_income
					this.my_storage = res.data.my_storage
					this.down_storage = res.data.down_storage
					this.month_income = res.data.month_income
					this.month_order_income = res.data.month_order_income
					this.month_sold_income = res.data.month_sold_income
					this.total_team_num = res.data.total_team_num
					this.month_team_num = res.data.month_team_num
					this.month_super_num = res.data.month_super_num
					this.month_top_num = res.data.month_top_num
					this.month_direct_num = res.data.month_direct_num
					this.team_rank = res.data.team_rank
					uni.stopPullDownRefresh()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-data {
		@include page();
		.content {
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
			.income, .team, .rank {
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
						@include flex();
						height: 100%;
						width: 123rpx;
						justify-content: flex-end;
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
				.team-rank-item {
					@include flex();
					height: 90rpx;
					padding: 12rpx 30rpx;
					box-sizing: border-box;
					justify-content: space-between;
					border-bottom: 1rpx solid $app-base-bg;
					image {
						width: 66rpx;
						height: 66rpx;
						border-radius: 50%;
						margin-right: 30rpx;
					}
					.user_name {
						overflow: hidden;
						font-size: 32rpx;
						margin-right: 30rpx;
						max-width: 300rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.level_name {
						@include flex();
						flex: 1;
						height: 100%;
						justify-content: flex-start;
						.levelname {
							@include flex();
							width: 130rpx;
							height: 36rpx;
							color: #FFFFFF;
							font-size: 20rpx;
							border-radius: 18rpx;
							background: $app-base-color;
							.cuIcon-crownfill {
								margin-right: 6rpx;
							}
						}
					}
					.moneyNum {
						font-size: 26rpx;
						color: $app-base-color;
					}
				}
			}
		}
	}
</style>
