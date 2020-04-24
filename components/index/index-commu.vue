<template>
	<view class="index-commu" :style="{ height: screenHeight - tabbarHeight - statusbarHeight + 'px', zIndex: SHOW ? '1' : '-1' }">
		<custom-nav :title="logged ? '' : '社区'" noback ref="ltm" />
		<view class="status_bar"> <!-- 这里是状态栏 --> </view>
		<view v-if="logged" class="content">
			<view class="swiper-nav">
				<view v-for="(item, index) in typeList" :key="index" class="item" :class="{ active: MIXIN_ActiveIndex === index }" @tap="switchSwiper(index)">{{ item }}</view>
				<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: 100 / typeList.length + '%' }"><text></text></view>
			</view>
			<view class="swiper-area">
				<pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="MIXIN_pulldownrefresh">
					<swiper class="swiper" :current="MIXIN_NowIndex" :duration="234" @transition="MIXIN_transition" @change="MIXIN_change" @animationfinish="MIXIN_animationfinish">
						<swiper-item v-for="(item, listsIndex) in typeList" :key="listsIndex">
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="commu-item" v-for="(commuItem, commuIndex) in lists[listsIndex]" :key="commuIndex">
									<view class="article-header">
										<image class="head-pic" :src="commuItem.avatar"></image>
										<view class="name">
											<text>{{ commuItem.user_name }}</text>
											<text v-if="commuItem.identity === 1" class="identity">官方</text>
										</view>
										<text class="time">{{ commuItem.time | DistanceNow }}</text>
									</view>
									<navigator :url="'../../pages/article-detail/article-detail?type=' + listsIndex + '&index=' + commuIndex "
										v-if="commuItem.type === 1" class="body type-article"
									>
										<view class="title ellipsis">{{ commuItem.title }}</view>
										<view class="des">{{ commuItem.des + '...' }}</view>
										<commu-article-imgs :article="commuItem.content" />
									</navigator>
									<navigator :url="'../../pages/article-detail/article-detail?type=' + listsIndex + '&index=' + commuIndex "
										v-else class="body type-video"
									>
										<view class="des">{{ commuItem.title }}</view>
										<view class="video-player">
											<text class="cuIcon-video"></text>
											<image :src="commuItem.poster" mode="center"></image>
										</view>
									</navigator>
									<view class="article-footer">
										<view class="footer-item" @tap="thumbs(listsIndex, commuIndex)">
											<text v-if="!commuItem.thumbs" class="cuIcon-appreciate icon-right left"></text>
											<text v-else class="cuIcon-appreciatefill icon-right left fill"></text>
											<text>点赞</text>
										</view>
										<view class="footer-item center" @tap="like(listsIndex, commuIndex)">
											<text v-if="!commuItem.liked" class="cuIcon-like icon-right"></text>
											<text v-else class="cuIcon-likefill icon-right fill"></text>
											<text>收藏</text>
										</view>
										<view class="footer-item" @tap="share">
											<text class="cuIcon-forward icon-right right"></text>
											<text>分享</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[listsIndex].length" :nomore="page[listsIndex] === 0" />
								<swiper-status v-else :page="page[listsIndex]" />
							</scroll-view>
						</swiper-item>
					</swiper>
				</pulldown-refresher>
			</view>
		</view>
		<view v-else class="login-btn" style="height: 100%;">
			<navigator url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import MIXIN from '@/mixin/swiper-list.js'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import commuArticleImgs from '@/components/public/commu-article-imgs.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	import { commuRecommend, commuNewest, commuChanglai, commuCollect } from '@/apis/index/commu.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher, commuArticleImgs },
		data() {
			return {
				title: '社区',
				page: [1, 1, 1, 1], // 每种类型的页数 当页数为零时表示当前类型没有更多了
				tabbarHeight: uni.upx2px(98), // tabbar 高度
				lists: { 0: [], 1: [], 2: [], 3: [] }, // 数据
				typeList: ['热门推荐', '最新更新', '常来微聊', '我的收藏'],
				apis: [commuRecommend, commuNewest, commuChanglai, commuCollect]
			}
		},
		computed: {
			screenHeight() { return this.$store.state.device.screenHeight },
			SHOW() { return this.$store.state.app.index_tabbar_index === 2 },
			statusbarHeight() { return this.$store.state.device.statusbarHeight },
			logged() { return this.$store.state.app.token.length === 0 ? false : true }
		},
		methods: {
			thumbs(listsIndex, commuIndex) {
				this.lists[listsIndex][commuIndex].thumbs = !this.lists[listsIndex][commuIndex].thumbs
			}, 
			like(listsIndex, commuIndex) {
				this.lists[listsIndex][commuIndex].liked = !this.lists[listsIndex][commuIndex].liked
			},
			share() {
				
			}
		},
		watch: {
			SHOW: {
				handler(val) {
					if (val) {
						if (!this.MIXIN_ScrollViewHeight) { // 如果 scrollvie 没有高度 就给它高度
							setTimeout(() => this.$offset('.swiper-area').then(res => this.MIXIN_ScrollViewHeight = res.height))
						}
						if (this.logged && !this.lists[this.MIXIN_NowIndex].length && this.page[this.MIXIN_NowIndex] !== 0) { // 当当前类型数量为 0 且有不是 没有更多时请求列表
							this.MIXIN_request()
						}
					}
				},
				immediate: true
			},
			lists: {
				handler(n) {
					this.$store.commit('article/UPDATA', n)
				},
				deep: true,
				immediate: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-commu {
		@include page();
		top: 0;
		left: 0;
		width: 100%;
		position: fixed;
		border-top-width: 0;
		.status_bar {
			width: 100%;
			background: $app-base-color;
			height: var(--status-bar-height);
		}
		.content {
			@include flex(column);
			.swiper-nav {
				text {
					width: 100rpx;
				}
			}
			.swiper-area {
				scroll-view {
					.commu-item {
						padding: 0 30rpx;
						margin-top: 10rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						.body {
							&.type-article {
								.title {
									font-size: 32rpx;
									margin-top: 10rpx;
									line-height: 36rpx;
								}
								.des {
									font-size: 26rpx;
									margin-top: 10rpx;
									line-height: 36rpx;
									color: $app-sec-text-color;
								}
							}
							&.type-video {
								.des {
									margin-top: 10rpx;
									font-size: 26rpx;
									line-height: 36rpx;
								}
								.video-player {
									@include flex();
									height: 280rpx;
									overflow: hidden;
									margin-top: 10rpx;
									position: relative;
									border-radius: 10rpx;
									.cuIcon-video {
										top: 50%;
										left: 50%;
										z-index: 1;
										color: #FFFFFF;
										font-size: 98rpx;
										position: absolute;
										transform: translate(-50%, -50%);
									}
									image {
										top: 0;
										left: 0;
										width: 100%;
										height: 100%;
										position: absolute;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
