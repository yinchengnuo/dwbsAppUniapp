<template>
	<view class="manage-people">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="chart">
				<view class="switch">
					<text :class="{ active: active === 7 }" @tap="switchChart(7)">7日</text>
					<text :class="{ active: active === 15 }" @tap="switchChart(15)">15日</text>
					<text :class="{ active: active === 30 }" @tap="switchChart(30)">30日</text>
				</view>
				<view class="chart-line">
					<chart-line :chartData="chartData" color="#F59C05" background="#FDECD0" unit="人" />
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
	import { _API_TeamChart } from '@/apis/team.js'
	import chartLine from '@/components/charts/chart-line.vue'
	export default {
		components: {
			chartLine
		},
		data() {
			return {
				title: '人员管理',
				chartData: {},
				active: 15,
				operationList: [
					{
						name: '团队管理',
						url: '../../pages/team-manage/team-manage',
						image: '../../static/index/index/team-manage.png'
					},
					{
						name: '团队业绩',
						url: '../../pages/team-achievement/team-achievement',
						image: '../../static/index/index/team-achievement.png'
					},
					{
						name: '我的邀请',
						url: '../../pages/my-invite/my-invite',
						image: '../../static/index/index/my-invite.png'
					},
					{
						name: '注册审核',
						url: '../../pages/register-examine/register-examine',
						image: '../../static/index/index/register-examine.png'
					},
					{
						name: '邀请代理',
						url: '../../pages/invite-proxy/invite-proxy',
						image: '../../static/index/index/invite-proxy.png'
					},
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
				_API_TeamChart({ day: this.active }).then(res => {
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
	.manage-people {
		@include page();
		.content {
			background: #FFFFFF;
			.chart {
				@include flex(column);
				height: 720rpx;
				background: #FDECD0;
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
