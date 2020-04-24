<template>
	<view class="index-commu-item">
		<navigator v-if="item.type == 2" class="live" :url="'../app-webview/app-webview?url=' + item.url">
			<view class="top ellipsis">{{ item.title }}</view>
			<view class="mid">
				<image class="poster" :src="item.imgurl"></image>
				<view class="center"><text class="cuIcon-playfill"></text>观看直播</view>
			</view>
			<view class="bot">
				<view class="bot-left">
					<image src="../../static/icon/live-time.png" mode=""></image>
					<text>开播时间: {{ item.created_at | formatDate }}</text>
				</view>
				<view class="bot-right">
					查看详情<text class="cuIcon-right"></text>
				</view>
			</view>
		</navigator>
		<view v-else>
			<view class="article-header">
				<image class="head-pic" :src="item.avatar"></image>
				<view class="name">
					<text>{{ item.author }}</text>
					<text v-if="item.off == 1" class="identity">官方</text>
				</view>
				<text class="time">{{ item.created_at | DistanceNow }}</text>
			</view>
			<navigator class="article-body" :url="'../../pages/article-detail/article-detail?type='+typeIndex+'&index='+listIndex">
				<view class="title ellipsis">{{ item.title }}</view>
				<view class="des">{{ item.summary + '...' }}</view>
				<view v-if="item.type == 0 && item.imgurl.length" class="img-list">
					<image v-if="item.imgurl[0]" :src="item.imgurl[0]"></image>
					<image v-if="item.imgurl[1]" :src="item.imgurl[1]"></image>
					<image v-if="item.imgurl[2]" :src="item.imgurl[2]"></image>
				</view>
				<view v-else-if="item.type == 1" class="img-poster">
					<image class="video-poster-img"  :src="item.imgurl[0]" mode="center"></image>
					<image class="video-poster-play" src="../../static/icon/Video.png"></image>
				</view>
			</navigator>
			<view class="article-footer">
				<view class="footer-item" @tap="like()">
					<text v-if="item.like" class="cuIcon-appreciatefill fill icon-right left"></text>
					<text v-else class="cuIcon-appreciate icon-right left"></text>
					<text>点赞</text>
				</view>
				<view class="footer-item center" @tap="collection()">
					<text v-if="item.collection" class="cuIcon-likefill fill icon-right"></text>
					<text v-else class="cuIcon-like icon-right"></text>
					<text>收藏</text>
				</view>
				<view class="footer-item" @tap="share()">
					<text class="cuIcon-forward icon-right right"></text>
					<text>分享</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _share from '@/common/util/share.js'
	import { ArticleURL } from '@/common/util/request.js'
	export default {
		props: {
			typeIndex: Number,
			listIndex: Number
		},
		computed: {
			item() {
				return this.$store.state.article.lists[this.typeIndex][this.listIndex]
			}
		},
		created() {
			setTimeout(() => uni.json(this.item), 123)
		},
		methods: {
			like() { // 点赞
				this.$store.commit('article/LIKE', { listsIndex: this.typeIndex, commuIndex: this.listIndex })
			}, 
			collection() { // 收藏
				this.$store.commit('article/COLLECTION', { listsIndex: this.typeIndex, commuIndex: this.listIndex })
			},
			share() { // 分享
				_share({
					type: 0,
					title: this.item.title,
					summary: this.item.summary,
					imageUrl: this.item.imgurl[0],
					href: ArticleURL + '?id=' + this.item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-commu-item {
		padding: 0 30rpx;
		margin-top: 10rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		.live {
			height: 420rpx;
			.top {
				height: 59rpx;
				font-size: 28rpx;
				line-height: 59rpx;
				border-bottom: 1rpx solid $app-base-bg;
			}
			.mid {
				@include flex();
				height: 300rpx;
				position: relative;
				.poster {
					position: absolute;
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
				.center {
					@include flex();
					opacity: 0.8;
					width: 159rpx;
					height: 44rpx;
					font-size: 24rpx;
					background: #FFFFFF;
					border-radius: 22rpx;
					color: $app-base-color;
					text {
						margin-right: 10rpx;
					}
				}
			}
			.bot {
				@include flex();
				height: 59rpx;
				font-size: 26rpx;
				justify-content: space-between;
				border-top: 1rpx solid $app-base-bg;
				.bot-left {
					@include flex();
					height: 100%;
					color: $app-base-color;
					image {
						width: 32rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
		.article-body {
			.title {
				font-size: 32rpx;
				margin-top: 10rpx;
				line-height: 36rpx;
			}
			.des {
				font-size: 26rpx;
				margin: 10rpx 0;
				line-height: 36rpx;
				color: $app-sec-text-color;
			}
			.img-list {
				@include flex();
				height: 150rpx;
				justify-content: space-between;
				image {
					height: 100%;
					width: 222rpx;
					border-radius: 10rpx;
				}
			}
			.img-poster {
				@include flex();
				height: 280rpx;
				position: relative;
				.video-poster-img {
					width: 100%;
					height: 100%;
					position: absolute;
					border-radius: 10rpx;
				}
				.video-poster-play {
					width: 68rpx;
					height: 68rpx;
				}
			}
		}
	}
</style>
