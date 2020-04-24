<template>
	<view class="register-examine">
		<custom-nav :title="title" ref="ltm"></custom-nav>
		<view class="content">
			<view class="swiper-nav">
				<view v-for="(item, index) in typeList" :key="index" class="item" :class="{ active: MIXIN_ActiveIndex === index }" @tap="switchSwiper(index)">{{ item }}</view>
				<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: 100 / typeList.length + '%' }"><text></text></view>
			</view>
			<view class="swiper-area">
				<pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="MIXIN_pulldownrefresh">
					<swiper class="swiper" :current="MIXIN_NowIndex" :duration="234" @transition="MIXIN_transition" @change="MIXIN_change" @animationfinish="MIXIN_animationfinish">
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="examine-item" v-for="(item, itemIndex) in lists[0]" :key="itemIndex">
									<view class="top">
										<view class="apply"> 申请人：{{ item.apply_name }} </view>
										<view class="invite">
											<text class="cuIcon-selection icon"></text>
											<text>邀请人：{{ item.invite_name }}</text>
										</view>
										<view class="time">
											<text class="cuIcon-time icon"></text>
											<text>申请时间：{{ item.apply_time }}</text>
										</view>
									</view>
									<view class="bot">
										<view class="left">
											<text class="name">状态：</text>
											<text v-if="item.intive_status == 0" class="basecolor">待审核</text>
											<text v-else class="status">{{ item.intive_status | getStatus(0, item.up_status) }}</text>
											<text v-if="item.intive_status == 2 || item.up_status == 2" class="reject">
												<text>驳回原因： </text>
												<text class="basecolor">{{ item.intive_cause || item.up_cause }}</text>
											</text>
										</view>
										<view v-if="item.intive_status === 0" class="right small-btn" @tap="toExamine(0, itemIndex)">去审核</view>
									</view>
									<image v-if="item.intive_status == 1 && item.up_status == 1" class="ispass" src="../../static/icon/pass.png"></image>
									<image v-if="item.intive_status == 2 || item.up_status == 2" class="ispass" src="../../static/icon/nopass.png"></image>
								</view>
								<custom-reach-bottom v-if="lists[0].length" :nomore="page[0] === 0" />
								<swiper-status v-else :page="page[0]" unit="审核" />
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="examine-item" v-for="(item, itemIndex) in lists[1]" :key="itemIndex">
									<view class="top">
										<view class="apply"> 申请人：{{ item.apply_name }} </view>
										<view class="invite">
											<text class="cuIcon-selection icon"></text>
											<text>邀请人：{{ item.invite_name }}</text>
										</view>
										<view class="time">
											<text class="cuIcon-time icon"></text>
											<text>申请时间：{{ item.apply_time }}</text>
										</view>
									</view>
									<view class="bot">
										<view class="left">
											<text class="name">状态：</text>
											<text v-if="item.up_status == 0" class="basecolor">待审核</text>
											<text v-else class="status">{{ item.up_status | getStatus(1) }}</text>
											<text v-if="item.up_status == 2" class="reject">
												<text>驳回原因：</text>
												<text class="basecolor">{{ item.up_cause }}</text>
											</text>
										</view>
										<view v-if="item.up_status === 0" class="right small-btn" @tap="toExamine(1, itemIndex)">去审核</view>
									</view>
									<image v-if="item.intive_status == 1 && item.up_status == 1" class="ispass" src="../../static/icon/pass.png"></image>
									<image v-if="item.intive_status == 2 || item.up_status == 2" class="ispass" src="../../static/icon/nopass.png"></image>
								</view>
								<custom-reach-bottom v-if="lists[1].length" :nomore="page[1] === 0" />
								<swiper-status v-else :page="page[1]" unit="审核" />
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
	import { _API_ExamineList_Invite, _API_ExamineList_Down } from '@/apis/team.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '注册审核',
				page: [1, 1], // 每种类型的页数 当页数为 0 时表示当前类型没有更多了 -1 表示请求失败
				lists: { 0: [], 1: []}, // 数据
				typeList: ['我的邀请', '我的下级'],
				apis: [_API_ExamineList_Invite, _API_ExamineList_Down]
			}
		},
		filters: {
			getStatus(status, type, up_status) { // 获取用户状态过滤器
				if (type == 0) { // 如果是我的邀请
					if (status == 1) {
						if (up_status == 0) {
							return '已通过 -> 等待上级审核'
						} else if (up_status == 1) {
							return '已通过 -> 上级已通过'
						} else if (up_status == 2) {
							return '上级未通过'
						}
					} else if (status == 2) {
						return '未通过'
					}
				} else if (type == 1) { // 如果是我的下级
					if (status == 0) {
						return '待审核'
					} else if (status == 1) {
						return '已通过'
					} else if (status == 2) {
						return '未通过'
					}
				}
			}
		},
		onLoad() {
			this.MIXIN_request()
			uni.$on('EXAMINEPASS', (type, index) => { // 订阅通过事件
				if (type === 0) {
					this.lists[type][index]['intive_status'] = 1
				} else if (type === 1) {
					this.lists[type][index]['up_status'] = 1
				}
			})
			uni.$on('EXAMINEREJECT', (type, index, reason) => { // 订阅驳回事件
				if (type === 0) {
					this.lists[type][index]['intive_status'] = 2
					this.lists[type][index]['intive_cause'] = reason
				} else if (type === 1) {
					this.lists[type][index]['up_status'] = 2
					this.lists[type][index]['up_cause'] = reason
				}
			})
		},
		methods: {
			toExamine(type, index) {
				uni.navigateTo({ url: `../examine-detail/examine-detail?type=${type}&index=${index}&data=${JSON.stringify(this.lists[type][index])}` })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.register-examine {
		@include page();
		.content {
			@include flex(column);
			.swiper-nav {
				text {
					width: 56rpx;
				}
			}
			.swiper-area {
				scroll-view {
					.examine-item {
						height: 270rpx;
						margin-top: 10rpx;
						background: #FFFFFF;
						position: relative;
						.top {
							@include flex(column);
							height: 180rpx;
							padding: 30rpx;
							box-sizing: border-box;
							border-bottom: 1rpx solid $app-base-bg;
							>view {
								flex: 1;
								width: 100%;
								font-size: 26rpx;
								color: $app-sec-text-color;
								&.apply {
									font-size: 32rpx;
									margin-bottom: 16rpx;
									color: $app-main-text-color;
								}
								&.invite, &.time {
									line-height: 44rpx;
									.icon { 
										font-size: 32rpx;
										margin-right: 20rpx;
										color: $app-base-color;
									}
								}
							}
						}
						.bot {
							@include flex();
							height: 90rpx;
							padding: 30rpx;
							font-size: 32rpx;
							box-sizing: border-box;
							
							justify-content: space-between;
							.left {
								flex: 1;
								@include flex();
								justify-content: flex-start;
								.status {
									color: $app-sec-text-color;
								}
								.reject {
									font-size: 26rpx;
									margin-left: 10rpx;
								}
							}
						}
						.ispass {
							top: 20rpx;
							width: 85rpx;
							right: 30rpx;
							height: 58rpx;
							position: absolute;
						}
					}
				}
			}
		}
	}
</style>
