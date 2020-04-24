<template>
	<view class="place-order">
		<custom-nav ref="ltm" :title="title" @rTap="navRight">
			<text :class="mode === 'list' ? 'cuIcon-apps' : 'cuIcon-list'" style="margin-right: 16px;"></text>
		</custom-nav>
		<view class="content">
			<scroll-view scroll-y :style="{ height: scrollviewHeight + 'px' }">
				<view
					:class="mode === 'list' ? 'list' : 'square'"
					v-for="item in goodsList" :key="item.id"
					@tap="tap(item.id, item.storage)"
				>
					<view class="img">
						<image :src="item.img"></image>
					</view>
					<view class="info">
						<view class="top">{{ item.name }}</view>
						<view class="mid">进货价：￥{{ item.price }}</view>
						<view class="bot">我的库存：{{ item.storage }}套</view>
					</view>
					<view class="buy">立即购买</view>
				</view>
				<view v-if="!goodsList.length" class="loading">加载中...</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { _API_GoodList } from '@/apis/good.js'
	export default {
		data() {
			return {
				title: '订货下单',
				mode: 'square',
				goodsList: [],
				scrollviewHeight: 0
			}
		},
		mounted() { // 获取商品列表
			this.$offset('.content').then(res => this.scrollviewHeight = res.height) // 设置scrollview 高
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			this.request()
		},
		methods: {
			request() {
				this.$refs.ltm.loading()
				_API_GoodList().then(res => {
					if (res.code === 200) {
						this.goodsList = res.data.list
					} else {
						this.$refs.ltm.toast('网络好像出了点问题，下拉刷新试试')
					}
				}).catch(() => setTimeout(() => this.$refs.ltm.toast('网络好像出了点问题，下拉刷新试试'), 123))
			},
			navRight() { // 切换显示模式
				this.mode = this.mode === 'list' ? 'square' : 'list'
			},
			tap(id, storage) { // 查看商品详情
				if (this.$store.state.userinfo.level === '特级代理') {
					this.$refs.ltm.toast('特级代理不能通过App下单')
				} else {
					uni.navigateTo({ url: `../good-detail/good-detail?id=${id}&storage=${storage}` })
				}
			}
		}
	}
</script>

<style lang="scss">
	.place-order {
		@include page();
		.content {
			.loading {
				text-align: center;
				margin-top: 567rpx;
			}
			.list {
				@include flex();
				height: 180rpx;
				background: #FFFFFF;
				margin-bottom: 10rpx;
				padding: 20rpx 30rpx;
				align-items: flex-end;
				box-sizing: border-box;
				.img {
					height: 100%;
					width: 140rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.info {
					@include flex(column);
					flex: 1;
					height: 100%;
					margin: 0 30rpx;
					justify-content: space-between;
					align-items: flex-start;
					view {
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						&.top {
							font-size: 32rpx;
						}
						&.mid {
							font-size: 26rpx;
							color: $app-base-color;
						}
						&.bot {
							font-size: 26rpx;
							color: $app-sec-text-color;
						}
					}
				}
				.buy {
					@include flex();
					width: 130rpx;
					height: 48rpx;
					font-size: 26rpx;
					color: $app-base-color;
					border: 2rpx solid $app-base-color;
				}
			}
			.square {
				@include flex(column);
				float: left;
				width: 335rpx;
				height: 500rpx;
				overflow: hidden;
				margin-top: 30rpx;
				margin-left: 30rpx;
				position: relative;
				background: #FFFFFF;
				border-radius: 10rpx;
				box-shadow: 0rpx 10rpx 14rpx 2rpx rgba(168, 168, 168, 0.56);
				&:nth-child(even) {
					margin-left: 20rpx;
				}
				.img {
					width: 100%;
					height: 335rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.info {
					@include flex(column);
					flex: 1;
					width: 100%;
					padding: 20rpx;
					box-sizing: border-box;
					align-items: flex-start;
					justify-content: space-between;
					view {
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						&.top {
							font-size: 32rpx;
						}
						&.mid {
							font-size: 28rpx;
							color: $app-base-color;
						}
						&.bot {
							font-size: 22rpx;
							color: $app-sec-text-color;
						}
					}
				}
				.buy {
					@include flex();
					right: 10rpx;
					bottom: 10rpx;
					width: 120rpx;
					height: 48rpx;
					color: #FFFFFF;
					font-size: 26rpx;
					position: absolute;
					border-radius: 10rpx;
					background: $app-base-color;
				}
			}
		}
	}
</style>
