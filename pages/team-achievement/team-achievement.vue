<template>
	<view class="team-achievement">
		<custom-nav ref="ltm" :title="title" />
		<w-picker ref="Selector1" mode="selector" defaultVal="全部代理" themeColor="#F76454" :selectList="typeList"  @confirm="onConfirm1" />
		<w-picker ref="Selector2" mode="selector" defaultVal="本日业绩" themeColor="#F76454" :selectList="timeList"  @confirm="onConfirm2" />
		<view class="content">
			<view class="chooser">
				<view class="picker" @tap="choosePicker1">
					<text class="icon-right">{{ typeList[choosed.type].label }}</text>
					<text class="cuIcon-unfold"></text>
				</view>
				<view class="picker" @tap="choosePicker2">
					<text class="icon-right">{{ timeList[choosed.time].label }}</text>
					<text class="cuIcon-unfold"></text>
				</view>
			</view>
			<view class="total">
				<text class="text">业绩合计</text>
				<text class="num">￥{{ total | numDot }}</text>
			</view>
			<view class="scroll">
				<pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="pulldownrefresh">
					<scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }" @scrolltolower="scrolltolower">
						<view class="item" v-for="(item, index) in list" :key="index">
							<image class="avatar" :src="item.avatar"></image>
							<view class="nickname ellipsis">{{ item.nickname }}</view>
							<view class="level-name"><text class="cuIcon-crownfill"></text>{{ item.level }}</view>
							<view class="money">￥{{ item.money | numDot }}</view>
						</view>
						<custom-reach-bottom v-if="list.length" :nomore="page === 0" />
						<swiper-status v-else :page="page" unit="团队成员" />
					</scroll-view>
				</pulldown-refresher>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_TeamAchievement } from '@/apis/team.js'
	import WPicker from '@/components/w-picker/w-picker.vue'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	export default {
		components: { WPicker, swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '团队业绩',
				typeList: [
					{ label: '全部代理', value: '全部代理' },
					{ label: '顶级代理', value: '顶级代理' },
					{ label: '特级代理', value: '特级代理' },
				],
				timeList: [
					{ label: '本日业绩', value: '本日业绩' },
					{ label: '本周业绩', value: '本周业绩' },
					{ label: '本月业绩', value: '本月业绩' },
				],
				choosed: { type: 0, time: 0 },
				total: 0,
				list: [],
				page: 1,
				scrollViewHeight: 0,
				requesting: false
			}
		},
		watch: {
			choosed: {
				deep: true,
				handler() {
					this.list = []
					this.pulldownrefresh()
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
						_API_TeamAchievement({ type: this.choosed.type, time: this.choosed.time, page: this.page }).then(res => {
							this.total = res.data.money // 设置业绩业绩数量
							!action ? this.list = [] : '' // 如果是下拉刷新，清空列表
							this.list = [...this.list, ...res.data.list]
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
			},
			choosePicker1() { // 点击选择等级
				this.$refs.Selector1.show()
			},
			choosePicker2() { // 点击选择时长
				this.$refs.Selector2.show()
			},
			onConfirm1(e) { // 确定等级选择
				this.choosed.type = e.defaultVal[0]
			},
			onConfirm2(e) { // 确定时长选择
				this.choosed.time = e.defaultVal[0]
			}
		}
	}
</script>

<style lang="scss">
	.team-achievement {
		@include page();
		.content {
			@include flex(column);
			.chooser {
				@include flex();
				width: 100%;
				background: #FFFFFF;
				.picker {
					@include flex();
					flex: 1;
					height: 84rpx;
				}
			}
			.total {
				@include flex();
				width: 100%;
				height: 90rpx;
				padding: 30rpx;
				font-size: 32rpx;
				margin-top: 10rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				justify-content: space-between;
				.num {
					color: $app-base-color;
				}
			}
			.scroll {
				flex: 1;
				width: 100%;
				margin-top: 10rpx;
				scroll-view {
					.item {
						@include flex();
						height: 120rpx;
						background: #FFFFFF;
						padding: 10rpx 30rpx;
						box-sizing: border-box;
						justify-content: space-between;
						border-bottom: 1rpx solid $app-base-bg;
						.avatar {
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
						.nickname {
							max-width: 300rpx;
						}
					}
				}
			}
		}
	}
</style>
