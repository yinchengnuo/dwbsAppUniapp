<template>
	<view class="index-index" :style="{ display: SHOW ? 'flex' : 'none' }">
		<custom-nav :title="title" noback />
		<view v-if="logged" class="content">
			<view class="area manage">
				<navigator v-for="(item, index) in namageList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</navigator>
			</view>
			<view class="area swiper">
				<swiper :autoplay="true" :circular="true" :interval="3456" :duration="345">
					<swiper-item v-for="(item, index) in swiperList" :key="index">
						<navigator :url="item.url">
							<image :src="item.image"></image>
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="area news">
				<image src="../../static/index/index/news.png"></image>
				<view class="hot">热点</view>
				<swiper :vertical="true" :autoplay="true" :circular="true" :interval="3456" :duration="345">
					<swiper-item v-for="(item, index) in newsList" :key="index">
						{{ item }}
					</swiper-item>
				</swiper>
			</view>
			<view class="area kingkong">
				<navigator v-for="(item, index) in kingkongList" :url="item.url" :key="index">
					<image :src="item.image"></image>
					<text>{{ item.name }}</text>
				</navigator>
			</view>
			<view class="area other">
				<navigator v-for="(item, index) in otherList" :url="item.url" :key="index">
					<image :src="item.image"></image>
				</navigator>
			</view>
			<view class="tabbar"></view>
		</view>
		<view v-else class="login-btn">
			<navigator url="../../pages/login-reg/login-reg">登录/注册</navigator>
		</view>
	</view>
</template>

<script>
	import { _API_IndexIndex } from '@/apis/index/index.js'
	export default {
		data() {
			return {
				title: '首页',
				namageList: [
					{
						name: '订单管理',
						url: '../../pages/manage-order/manage-order',
						image: '../../static/index/index/manage-order.png'
					},
					{
						name: '人员管理',
						url: '../../pages/manage-people/manage-people',
						image: '../../static/index/index/manage-poeple.png'
					},
					{
						name: '财富管理',
						url: '../../pages/manage-money/manage-money',
						image: '../../static/index/index/manage-money.png'
					}
				],
				swiperList: [],
				newsList: [],
				kingkongList: [
					{
						name: '订货下单',
						url: '../../pages/place-order/place-order',
						image: '../../static/index/index/place-order.png'
					},
					{
						name: '我的订单',
						url: '../../pages/my-order/my-order',
						image: '../../static/index/index/my-order.png'
					},
					{
						name: '下级订单',
						url: '../../pages/down-order/down-order',
						image: '../../static/index/index/down-order.png'
					},
					{
						name: '我的库存',
						url: '../../pages/my-stock/my-stock',
						image: '../../static/index/index/my-stock.png'
					},
					{
						name: '邀请代理',
						url: '../../pages/invite-proxy/invite-proxy',
						image: '../../static/index/index/invite-proxy.png'
					},
					{
						name: '注册审核',
						url: '../../pages/register-examine/register-examine',
						image: '../../static/index/index/register-examine.png'
					},
					{
						name: '我的邀请',
						url: '../../pages/my-invite/my-invite',
						image: '../../static/index/index/my-invite.png'
					},
					{
						name: '团队管理',
						url: '../../pages/team-manage/team-manage',
						image: '../../static/index/index/team-manage.png'
					}
				],
				otherList: [
					{
						url: '../../pages/test/test',
						image: '../../static/index/index/new-book.png'
					},
					{
						url: '../../pages/test/test',
						image: '../../static/index/index/how-order.png'
					},
					{
						url: '../../pages/test/test',
						image: '../../static/index/index/invite.png'
					},
					{
						url: '../../pages/test/test',
						image: '../../static/index/index/infobind.png'
					}
				]
			}
		},
		computed: {
			SHOW() { return this.$store.state.app.index_tabbar_index === 0 },
			logged() { return this.$store.state.app.token.length === 0 ? false : true }
		},
		created() {
			uni.$on('INDEXPULLDOWNREFRESH0', () => {
				this.indexRequest()
			})
		},
		watch: {
			SHOW: {
				handler(val) {
					if (val) {
						if (!this.newsList.length || !this.newsList.length) {
							uni.startPullDownRefresh()
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			indexRequest() {
				_API_IndexIndex().then(res => {
					uni.stopPullDownRefresh()
					this.newsList = res.data.newsList
					this.swiperList = res.data.swiperList
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-index {
		@include page();
		.content {
			.area {
				background: #FFFFFF;
				&.manage {
					height: 170rpx;
					display: flex;
					navigator {
						flex: 1;
						height: 100%;
						display: flex;
						align-items: center;
						flex-direction: column;
						image {
							width: 94rpx;
							height: 94rpx;
							margin-top: 20rpx;
						}
						text {
							font-size:32rpx;
							margin-top: 10rpx;
						}
					}
				}
				&.swiper {
					height: 250rpx;
					margin-top: 12rpx;
					swiper {
						height: 100%;
						navigator {
							height: 100%;
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				&.news {
					display: flex;
					height: 50rpx;
					padding: 10rpx 30rpx;
					box-sizing: border-box;
					image {
						height: 100%;
						width: 180rpx;
					}
					.hot {
						@include flex();
						width: 72rpx;
						height: 100%;
						font-size: 24rpx;
						margin-left: 10rpx;
						border-radius: 4rpx;
						color: $app-base-color;
						border:1px solid $app-base-color;
					}
					swiper {
						flex: 1;
						height: 100%;
						font-size: 26rpx;
						margin-left: 20rpx;
					}
				}
				&.other {
					@include flex();
					height: 200rpx;
					padding: 0 30rpx;
					margin-top: 10rpx;
					box-sizing: border-box;
					navigator {
						@include flex();
						flex: 1;
						image {
							width: 168rpx;
							height: 175rpx;
						}
					}
				}
			}
			.tabbar {
				height: $app-tabbar-height;
			}
		}
	}
</style>
