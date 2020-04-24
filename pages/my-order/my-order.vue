<template>
	<view class="my-order">
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
								<view class="order-item" v-for="(orderItem) in lists[0]" :key="orderItem.order_num">
									<view class="order-num">
										<text>订单编号：{{ orderItem.order_num }}</text>
										<text class="basecolor">未付款</text>
									</view>
									<view class="good-item" v-for="(goodItem, goodIndex) in orderItem.goodList" :key="goodIndex">
										<image :src="goodItem.img"></image>
										<view class="info">
											<text class="name">{{ goodItem.name }}</text>
											<text class="num">数量：{{ goodItem.num }}件</text>
											<text class="price">金额：￥{{ goodItem.price * goodItem.num + '.00' }}</text>
										</view>
									</view>
									<view class="totalPrice">
										<text>合计：<text class="basecolor">{{ orderItem | total }}</text></text>
										<view class="right">
											<text class="small-btn" @tap="toDetail(orderItem.order_num)">查看订单</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[0].length" :nomore="page[0] === 0" />
								<swiper-status v-else :page="page[0]" />
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="order-item" v-for="(orderItem, orderIndex) in lists[1]" :key="orderItem.order_num">
									<view class="order-num">
										<text>订单编号：{{ orderItem.order_num }}</text>
									</view>
									<view class="good-item" v-for="(goodItem, goodIndex) in orderItem.goodList" :key="goodIndex">
										<image :src="goodItem.img"></image>
										<view class="info">
											<text class="name">{{ goodItem.name }}</text>
											<text class="num">数量：{{ goodItem.num }}件</text>
											<text class="price">金额：￥{{ goodItem.price * goodItem.num + '.00' }}</text>
										</view>
									</view>
									<view class="totalPrice">
										<text>合计：<text class="basecolor">{{ orderItem | total }}</text></text>
										<view class="right">
											<text class="small-btn" @tap="confirmReceive(orderItem.order_num, orderIndex)">确认收货</text>
											<text v-if="orderItem.forward" class="small-btn" @tap="toForward(orderItem.order_num)">查看转单</text>
											<text class="small-btn" @tap="toDetail(orderItem.order_num)">查看订单</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[1].length" :nomore="page[1] === 0" />
								<swiper-status v-else :page="page[1]" />
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="order-item" v-for="(orderItem) in lists[2]" :key="orderItem.order_num">
									<view class="order-num">
										<text>订单编号：{{ orderItem.order_num }}</text>
										<text v-if="orderItem.status == 3" class="basecolor">已完成</text>
										<text v-if="orderItem.status == 4" >已取消</text>
									</view>
									<view class="good-item" v-for="(goodItem, goodIndex) in orderItem.goodList" :key="goodIndex">
										<image :src="goodItem.img"></image>
										<view class="info">
											<text class="name">{{ goodItem.name }}</text>
											<text class="num">数量：{{ goodItem.num }}件</text>
											<text class="price">金额：￥{{ goodItem.price * goodItem.num + '.00' }}</text>
										</view>
									</view>
									<view class="totalPrice">
										<text>合计：<text class="basecolor">{{ orderItem | total }}</text></text>
										<view class="right">
											<text v-if="orderItem.forward" class="small-btn" @tap="toForward(orderItem.order_num)">查看转单</text>
											<text class="small-btn" @tap="toDetail(orderItem.order_num)">查看订单</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[2].length" :nomore="page[2] === 0" />
								<swiper-status v-else :page="page[2]" />
							</scroll-view>
						</swiper-item>
					</swiper>
				</pulldown-refresher>
			</view>
		</view>
	</view>
</template>

<script>
	import { deepClone } from '@/common/util/index.js'
	import MIXIN from '@/mixin/swiper-list.js'
	import swiperStatus from '@/components/public/swiper-status.vue'
	import pulldownRefresher from '@/components/public/pulldown-refresher.vue'
	import customReachBottom from '@/components/public/custom-reach-bottom.vue'
	import { _API_OrderMyExamine, _API_OrderMySended, _API_OrderMyCompleted, _API_OrderReceiveGoods } from '@/apis/order.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '我的订单',
				page: [1, 1, 1], // 每种类型的页数 当页数为 0 时表示当前类型没有更多了 -1 表示请求失败
				lists: { 0: [], 1: [], 2: [] }, // 数据
				typeList: ['待审核', '待收货', '已完成'],
				apis: [_API_OrderMyExamine, _API_OrderMySended, _API_OrderMyCompleted]
			}
		},
		filters: {
			total(orderItem) { // 计算订单总金额过滤器
				return '￥ ' + orderItem.goodList.reduce((t, e) => t + (+e.num * +e.price), 0) + '.00'
			}
		},
		onLoad(opt) {
			if (opt.type === '0') { this.MIXIN_NowIndex = 0 } 
			else if (opt.type === '1') { this.MIXIN_NowIndex = 1 } 
			else if (opt.type === '2') { this.MIXIN_NowIndex = 2 }
			this.MIXIN_request()
		},
		methods: {
			confirmReceive(order_num, index) { // 点击确认收货
				this.$refs.ltm.modal('提示', ['确定收到商品？']).then(() => {
					this.$refs.ltm.loading()
					_API_OrderReceiveGoods({ order_num }).then(res => {
						if (res.code === 200) {
							const list1 = deepClone(this.lists[1])
							list1.splice(index, 1) // 把当前订单从待收货列表删除
							this.$set(this.lists, 1, list1)
							this.$refs.ltm.toast('收货成功')
						} else {
							this.$refs.ltm.toast('收货失败，请稍后重试')
						}
					})
				}).catch(() => {
					this.$refs.ltm.toast('取消确认')
				})
			},
			MIXIN_requestHandle(res) {
				console.log(res)
			},
			toDetail(order_num) { // 点击查看订单
				uni.navigateTo({ url: `../order-detail/order-detail?order_num=${order_num}` })
			},
			toForward(order_num) { // 点击查看转单
				uni.navigateTo({ url: `../order-detail/order-detail?order_num=${order_num}&forward=1` })
			}
		}
	}
</script>

<style lang="scss">
	.my-order {
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
					.order-item {
						background: #FFFFFF;
						> view {
							padding: 0 30rpx;
							box-sizing: border-box;
						}
						.order-num {
							@include flex();
							height: 60rpx;
							font-size: 26rpx;
							justify-content: space-between;
							border-top: 10rpx solid $app-base-bg;
							border-bottom: 1rpx solid $app-base-bg;
						}
						.good-item {
							@include flex();
							height: 180rpx;
							padding: 0 30rpx;
							margin-bottom: 1rpx;
							background: #FFFFFF;
							box-sizing: border-box;
							justify-content: space-between;
							border-bottom: 1rpx solid $app-base-bg;
							image {
								width: 140rpx;
								height: 140rpx;
							}
							.info {
								@include flex(column);
								flex: 1;
								height: 100%;
								margin: 0 30rpx;
								align-items: flex-start;
								justify-content: flex-start;
								.name {
									font-size: 32rpx;
									margin-top: 20rpx;
								}
								.num {
									font-size: 26rpx;
									margin-top: 10rpx;
									color: $app-sec-text-color;
								}
								.price {
									font-size: 26rpx;
									margin-top: 10rpx;
									color: $app-base-color;
								}
							}
						}
						.totalPrice {
							@include flex();
							height: 100rpx;
							font-size: 26rpx;
							justify-content: space-between;
							.right {
								@include flex();
								flex: 1;
								height: 100%;
								justify-content: flex-end;
							}
						}
					}
				}
			}
		}
	}
</style>
