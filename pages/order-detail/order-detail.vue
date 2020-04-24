<template>
	<view class="order-detail">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="address">
				<view class="name-tel">
					<text class="name">收货人：{{ address.con_name || '' }}</text>
					<text class="tel">{{ address.con_mobile }}</text>
				</view>
				<viwe class="address-text">{{ address | getAddressString }}</viwe>
			</view>
			<view class="order">
				<view class="order-num">
					<text>订单编号：{{ order_num }}</text>
					<text>订单状态：{{ order_status | getOrderStatus }}</text>
				</view>
				<view class="order-time">
					<text>下单时间：{{ order_time | formatTime }}</text>
					<view class="to-order-detail"></view>
				</view>
				<view class="goog-item" v-for="(goodItem, goodIndex) in list" :key="goodIndex">
					<view class="goodinfo">
						<image :src="goodItem.img"></image>
						<view class="info">
							<text class="name">{{ goodItem.name }}</text>
							<text class="price">进货价：￥{{ goodItem.price + '.00' }}</text>
							<text class="storage">我的库存：{{ goodItem.storage }}</text>
						</view>
					</view>
					<view class="type-item" v-for="(typeItem, typeIndex) in goodItem.typeList" :key="typeIndex">
						<view class="size-item" v-for="(size, sizeIndex) in typeItem.size" :key="sizeIndex">
							<view class="type-size-price">
								<text>款式：{{ typeItem.name }} <text style="margin-left: 20px;">尺寸：{{ size }}</text></text>
								<text class="basecolor">￥{{ goodItem.price * typeItem.num[sizeIndex] }}</text>
							</view>
							<view class="num">×{{ ' ' + typeItem.num[sizeIndex] }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="remark">备注：{{ remark }}</view>
			<view class="totalPrice">
				<text>总计金额</text>
				<text class="basecolor">{{ '￥ ' + totalPrice + '.00' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_OrderDetail } from '@/apis/order.js'
	export default {
		data() {
			return {
				title: '订单详情',
				list: [],  // 商品列表
				remark: '',  // 订单备注
				address: {},  // 订单地址
				order_num: '',  // 订单号
				order_time: '',  // 订单时间
				order_status: '',  // 订单状态
			}
		},
		computed: {
			totalPrice() {
				return this.list.reduce((t, e) => {
					return e.typeList.reduce((tt, ee) => {
						return ee.num.reduce((ttt, eee) => {
							return ttt + eee * e.price
						}, tt)
					}, t)
				}, 0)
			}
		},
		onLoad(opt) {
			this.$refs.ltm.loading()
			if (opt.forward) { // 如果是查看转单部分
				this.title = '转单详情'
			}
			_API_OrderDetail({ order_num: opt.order_num, type: opt.forward ? 'turn' : 'normal' }).then(res => {
				console.log(res.data)
				this.list = res.data.goodList // 商品列表
				this.remark = res.data.remark // 订单备注
				this.address = res.data.address // 订单地址
				this.order_num = res.data.order_num // 订单号
				this.order_time = res.data.time // 订单时间
				this.order_status = res.data.status // 订单状态
			})
		}
	}
</script>

<style lang="scss">
	.order-detail {
		@include page();
		.content {
			.address {
				font-size: 26rpx;
				background: #FFFFFF;
				padding: 20rpx 30rpx;
				margin-bottom: 10rpx;
				box-sizing: border-box;
				.name-tel {
					@include flex();
					margin-bottom: 20rpx;
					justify-content: space-between;
					.name {
						font-size: 32rpx;
					}
				}
			}
			.order {
				border-bottom: 10rpx solid $app-base-bg;
				.order-num, .order-time {
					@include flex();
					height: 60rpx;
					padding: 0 30rpx;
					font-size: 26rpx;
					margin-bottom: 1rpx;
					background: #FFFFFF;
					box-sizing: border-box;
					justify-content: space-between;
					&.order-time {
						margin-bottom: 10rpx;
						.to-order-detail {
							@include flex();
						}
					}
				}
				.goog-item {
					.goodinfo {
						@include flex();
						height: 180rpx;
						padding: 0 30rpx;
						margin-bottom: 1rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						justify-content: space-between;
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
							.price {
								font-size: 26rpx;
								margin-top: 10rpx;
								color: $app-base-color;
							}
							.storage {
								font-size: 26rpx;
								margin-top: 10rpx;
								color: $app-sec-text-color;
							}
						}
					}
					.size-item {
						@include flex();
						height: 100rpx;
						font-size: 32rpx;
						padding: 0 30rpx;
						margin-bottom: 1rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						justify-content: space-between;
						.type-size-price {
							@include flex(column);
							flex: 1;
							height: 100%;
							font-size: 26rpx;
							align-items: flex-start;
							> text {
								@include flex();
								flex: 1;
								width: 100%;
								justify-content: flex-start;
							}
						}
					}
				}
			}
			.remark {
				min-height: 90rpx;
				background: #FFFFFF;
				margin-bottom: 10rpx;
				padding: 20rpx 30rpx;
				border-bottom: 10rpx solid $app-base-bg;
			}
			.totalPrice {
				@include flex();
				height: 91rpx;
				padding: 0 30rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				justify-content: space-between;
				border-bottom: 1rpx solid $app-base-bg;
				&.other {
					color: $app-sec-text-color;
				} 
			}
		}
	}
</style>
