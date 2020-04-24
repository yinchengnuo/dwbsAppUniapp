<template>
	<view class="team-manage">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="add-num">
				<view class="left">
					<view class="num basecolor"><text>{{ dayAdd || 0 }}人</text></view>
					<view class="text">今日新增代理</view>
				</view>
				<view class="right">
					<view class="num basecolor"><text>{{ monthAdd || 0 }}人</text></view>
					<view class="text">本月新增代理</view>
				</view>
			</view>
			<view class="swiper-nav">
				<view v-for="(item, index) in typeList" :key="index" class="item" :class="{ active: MIXIN_ActiveIndex === index }" @tap="switchSwiper(index)">{{ item }}</view>
				<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: 100 / typeList.length + '%' }"><text></text></view>
			</view>
			<view class="swiper-area">
				<pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="MIXIN_pulldownrefresh">
					<swiper class="swiper" :current="MIXIN_NowIndex" :duration="234" @transition="MIXIN_transition" @change="MIXIN_change" @animationfinish="MIXIN_animationfinish">
						<swiper-item v-for="(item, index) in typeList" :key="index">
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="team-item" v-for="(item, itemIndex) in lists[index]" :key="itemIndex" @tap="toPerson(item.id)">
									<view class="left">
										<image :src="item.avatar"></image>
										<text class="ellipsis">{{ item.nickname }}</text>
									</view>
									<view class="right">
										<view class="level-name"><text class="cuIcon-crownfill"></text>{{ item.level }}</view>
										<text class="cuIcon-right"></text>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[index].length" :nomore="page[index] === 0" />
								<swiper-status v-else :page="page[index]" unit="团队成员" />
							</scroll-view>
						</swiper-item>
					</swiper>
				</pulldown-refresher>
			</view>
		</view>
	</view>
</template>

<script>
	import MIXIN from '@/mixin/swiper-list.js'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	import { _API_TeamList_Direct, _API_TeamList_Down } from '@/apis/team.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '团队管理',
				dayAdd: 0,
				monthAdd: 0,
				page: [1, 1], // 每种类型的页数 当页数为 0 时表示当前类型没有更多了 -1 表示请求失败
				lists: { 0: [], 1: [] }, // 数据
				typeList: ['直属代理', '下级代理'],
				apis: [_API_TeamList_Direct, _API_TeamList_Down]
			}
		},
		onLoad() { // 发起请求
			this.MIXIN_request()
		},
		methods: {
			MIXIN_requestHandle(res) {
				this.dayAdd = res.data.today_new
				this.monthAdd = res.data.month_new
			},
			toPerson(id) {
				uni.navigateTo({ url: `../person-card/person-card?id=${id}` })
			}
		}
	}
</script>

<style lang="scss">
	.team-manage {
		@include page();
		.content {
			@include flex(column);
			.swiper-nav {
				text {
					width: 56rpx;
				}
				margin-bottom: 10rpx;
			}
			.swiper-area {
				scroll-view {
					.team-item {
						@include flex();
						height: 90rpx;
						background: #FFFFFF;
						padding: 0 30rpx;
						box-sizing: border-box;
						border-bottom: 1rpx solid $app-base-bg;
						.left {
							@include flex();
							flex: 1;
							height: 100%;
							justify-content: flex-start;
							image {
								width: 66rpx;
								height: 66rpx;
								border-radius: 50%;
							}
							text {
								width: 370rpx;
								margin-left: 30rpx;
							}
						}
						.right {
							@include flex();
							height: 100%;
							width: 180rpx;
							justify-content: space-between;
							>text {
								font-size: 32rpx;
							}
						}
					}
				}
				margin-bottom: 10rpx;
			}
			.add-num {
				@include flex();
				width: 100%;
				height: 200rpx;
				background: #FFFFFF;
				margin-bottom: 10rpx;
				>view {
					@include flex(column);
					flex: 1;
					height: 100%;
					.num {
						text {
							font-size: 42rpx;
						}
					}
					.text {
						font-size: 26rpx;
						margin-top: 30rpx;
					}
				}
			}
		}
	}
</style>
