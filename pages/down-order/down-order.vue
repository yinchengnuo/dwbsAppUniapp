<template>
	<view class="down-order">
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
								<view class="order-item" v-for="(orderItem, orderIndex) in lists[0]" :key="orderItem.order_num" v-if="orderItem">
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
											<text class="small-btn dank" @tap="delOrder(orderItem.order_num, orderIndex)">删除订单</text>
											<text class="small-btn" @tap="comfirmMon(orderItem.order_num, orderIndex)">确认收款</text>
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
											<text class="small-btn" @tap="toSend(orderItem.order_num, orderIndex)">去发货</text>
											<text class="small-btn" @tap="toDetail(orderItem.order_num)">查看订单</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[1].length" :nomore="page[1] === 0" />
								<swiper-status v-else :page="page[1]" />
							</scroll-view>
						</swiper-item>
						<swiper-item v-for="(item, index) in typeList" :key="index" v-if="index > 1">
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }" @scrolltolower="MIXIN_scrolltolower">
								<view class="order-item" v-for="(orderItem) in lists[index]" :key="orderItem.order_num">
									<view class="order-num">
										<text>订单编号：{{ orderItem.order_num }}</text>
										<text v-if="index === 4 && orderItem.status == 3" class="basecolor">已完成</text>
										<text v-if="index === 4 && orderItem.status == 4">已取消</text>
									</view>
									<view class="good-item" v-for="(goodItem, goodIndex) in orderItem.goodList" :key="goodIndex.order_num">
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
											<text class="small-btn" @tap="toDetail(orderItem.order_num, index)">查看订单</text>
										</view>
									</view>
								</view>
								<custom-reach-bottom v-if="lists[index].length" :nomore="page[index] === 0" />
								<swiper-status v-else :page="page[index]" />
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
	import {
		_API_OrderDownWillpay, 
		_API_OrderDownWillsend, 
		_API_OrderDownSended, 
		_API_OrderDownForward, 
		_API_OrderDownCompleted,
		_API_OrderReceiveMoney,
		_API_OrderDel
	} from '@/apis/order.js'
	export default {
		mixins: [MIXIN],
		components: { swiperStatus, customReachBottom, pulldownRefresher },
		data() {
			return {
				title: '下级订单',
				page: [1, 1, 1, 1, 1], // 每种类型的页数 当页数为零时表示当前类型没有更多了
				lists: { 0: [], 1: [], 2: [], 3: [], 4: [] }, // 数据
				typeList: ['待审核', '待发货', '已发货', '已转单', '已完成'],
				apis: [_API_OrderDownWillpay, _API_OrderDownWillsend, _API_OrderDownSended, _API_OrderDownForward, _API_OrderDownCompleted]
				
			}
		},
		filters: {
			total(orderItem) {
				return '￥ ' + orderItem.goodList.reduce((t, e) => t + (+e.num * +e.price), 0) + '.00'
			}
		},
		onLoad(opt) {
			this.MIXIN_request()
			uni.$on('SENDGOOD', index => { // 将已发货订单从待发货订单删除
				const list1 = deepClone(this.lists[1])
				list1.splice(index, 1) // 把当前订单从待审核列表删除
				this.$set(this.lists, 1, list1)
			})
		},
		methods: {
			toDetail(order_num, index) { // 点击查看订单
				if (index == 3) { // 查看转单详情
					uni.navigateTo({ url: `../order-detail/order-detail?order_num=${order_num}&forward=1` })
				} else { // 查看订单详情
					uni.navigateTo({ url: `../order-detail/order-detail?order_num=${order_num}` })
				}
			},
			delOrder(order_num, index) { // 点击删除订单
				this.$refs.ltm.modal('提示', ['确定要删除这个订单']).then(() => {
					this.$refs.ltm.loading()
					_API_OrderDel({ order_num }).then(res => {
						if (res.code === 200) {
							const list0 = deepClone(this.lists[0])
							list0.splice(index, 1) // 把当前订单从待审核列表删除
							this.$set(this.lists, 0, list0)
							this.$refs.ltm.toast('删除成功')
						} else {
							this.$refs.ltm.toast('删除失败，请稍后重试')
						}
					})
				}).catch(() => {
					this.$refs.ltm.toast('取消删除')
				})
			},
			comfirmMon(order_num, index) { // 确认收款
				this.$refs.ltm.modal('提示', ['确定收到货款？']).then(() => {
					this.$refs.ltm.loading()
					_API_OrderReceiveMoney({ order_num }).then(res => {
						if (res.code === 200) {
							const list0 = deepClone(this.lists[0])
							list0.splice(index, 1) // 把当前订单从待审核列表删除
							this.$set(this.lists, 0, list0)
							this.$refs.ltm.toast('确认成功，请及时发货')
						} else {
							this.$refs.ltm.toast('确认失败，请稍后重试')
						}
					})
				}).catch(() => {
					this.$refs.ltm.toast('取消确认')
				})
			},
			toSend(order_num, index) { // 点击去发货
				uni.navigateTo({ url: `../send-good/send-good?index=${index}&order_num=${order_num}&num=${this.lists[1].length}` })
			}
		}
	}
</script>

<style lang="scss">
	.down-order {
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
