<template>
	<view class="my-invite">
		<custom-nav ref="ltm" :title="title" />
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
								<view class="team-item" v-for="(item, itemIndex) in lists[0]" :key="itemIndex" @tap="toPerson(item.id)">
									<image class="left" :src="item.avatar"></image>
									<view class="center">
										<view class="top">
											<text class="ellipsis">{{ item.nickname }}</text>
											<view class="level-name"><text class="cuIcon-crownfill"></text>{{ item.level }}</view>
										</view>
										<view class="bot">{{ item.created_at + ' 加入' }}</view>
									</view>
									<text class="right cuIcon-right"></text>
								</view>
								<custom-reach-bottom v-if="lists[0].length" :nomore="page[0] === 0" />
								<swiper-status v-else :page="page[0]" unit="邀请" />
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="team-item" v-for="(item, itemIndex) in lists[1]" :key="itemIndex">
									<image class="left" :src="item.avatar"></image>
									<view class="center">
										<view class="top">
											<text class="ellipsis">{{ item.nickname }}</text>
											<view class="level-name"><text class="cuIcon-crownfill"></text>{{ item.level }}</view>
										</view>
										<view class="bot">{{ item.created_at + ' 加入' }}</view>
									</view>
									<text></text>
								</view>
								<custom-reach-bottom v-if="lists[1].length" :nomore="page[1] === 0" />
								<swiper-status v-else :page="page[1]" unit="邀请" />
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
	import { _API_TeamInviteActive, _API_TeamInviteNoActive } from '@/apis/team.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '我的邀请',
				page: [1, 1], // 每种类型的页数 当页数为 0 时表示当前类型没有更多了 -1 表示请求失败
				lists: { 0: [], 1: []}, // 数据
				typeList: ['激活(0)', '未激活(0)'],
				apis: [_API_TeamInviteActive, _API_TeamInviteNoActive]
			}
		},
		onLoad() { // 发起请求
			this.MIXIN_request()
		},
		methods: {
			MIXIN_requestHandle(res) {
				this.$set(this.typeList, this.MIXIN_NowIndex, this.typeList[this.MIXIN_NowIndex].replace(/\d+/g, res.data.total))
			},
			toPerson(id) {
				uni.navigateTo({ url: `../person-card/person-card?id=${id}` })
			}
		}
	}
</script>

<style lang="scss">
	.my-invite {
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
						height: 120rpx;
						padding: 0 30rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						border-bottom: 1rpx solid $app-base-bg;
						.left {
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
						.center {
							@include flex(column);
							flex: 1;
							height: 100%;
							margin: 0 30rpx;
							align-items: flex-start;
							.top {
								@include flex();
								width: 100%;
								justify-content: flex-start;
								.ellipsis {
									width: 345rpx;
								}
							}
							.bot {
								font-size: 24rpx;
								margin-top: 8rpx;
								color: $app-sec-text-color;
							}
						}
						.right {
							@include flex();
							font-size: 32rpx;
						}
					}
				}
				margin-bottom: 10rpx;
			}
		}
	}
</style>
