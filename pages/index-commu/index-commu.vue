<template>
	<view class="index-commu">
		<custom-nav :title="title" ref="ltm" noback />
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
								<index-commu-item 
									v-for="(commuItem, commuIndex) in lists[listsIndex]" 
									:key="commuIndex" :typeIndex="listsIndex" :listIndex="commuIndex" 
								/>
								<custom-reach-bottom v-if="lists[listsIndex].length" :nomore="page[listsIndex] === 0" />
								<swiper-status v-else :page="page[listsIndex]" unit="文章" />
							</scroll-view>
						</swiper-item>
					</swiper>
				</pulldown-refresher>
			</view>
		</view>
		<view v-else class="login-btn" style="height: 100%;">
			<navigator open-type="reLaunch" url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import MIXIN from '@/mixin/swiper-list.js'
	import { indexCommuItem } from './index-commu-item.vue'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	import { commuRecommend, commuNewest, commuChanglai, commuCollect } from '@/apis/commu.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher, indexCommuItem },
		data() {
			return {
				title: '社区',
				page: [1, 1, 1, 1], // 每种类型的页数 当页数为零时表示当前类型没有更多了
				lists: { 0: [], 1: [], 2: [], 3: [] }, // 数据
				typeList: ['热门推荐', '最新更新', '常来微聊', '我的收藏'],
				apis: [commuRecommend, commuNewest, commuChanglai, commuCollect]
			}
		},
		computed: {
			logged() { return this.$store.state.app.token ? true : false },
			screenHeight() { return this.$store.state.device.screenHeight },
			SHOW() { return this.$store.state.app.index_tabbar_index === 2 },
			statusbarHeight() { return this.$store.state.device.statusbarHeight },
		},
		onBackPress() { // 返回时收起分享
			if (uni._SHARE && uni._SHARE.isVisible()) {
				uni._MASK.hide()
				uni._SHARE.hide()
				return true
			}
		},
		onLoad() {
			if (this.logged) {
				this.MIXIN_request()
			}
		},
		onShow() { // 页面展示时查看是否是从首页点进来的
			if (uni.getStorageSync('_INDEXARTICLETAP')) {
				this.switchSwiper(2)
				uni.removeStorageSync('_INDEXARTICLETAP')
			}
		},
		watch: {
			lists: {
				handler(n) {
					this.$store.commit('article/UPDATA', n)
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			MIXIN_requestHandle(res) {
				console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-commu {
		@include page();
		.content {
			@include flex(column);
			.swiper-nav {
				text {
					width: 56rpx;
				}
			}
		}
	}
</style>
