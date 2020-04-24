<template>
	<view class="article-detail">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="article-header">
				<image class="head-pic" :src="article.avatar"></image>
				<view class="name">
					<text>{{ article.author }}</text>
					<text v-if="article.off == 1" class="identity">官方</text>
				</view>
				<text class="time">{{ article.created_at | DistanceNow }}</text>
			</view>
			<view class="webview">
				<web-view :webview-styles="webviewStyles" :src="baseURL + '?id=' + article.id"></web-view>
			</view>
			<view class="article-footer">
				<view class="footer-item" @tap="like()">
					<text v-if="article.like" class="cuIcon-appreciatefill fill icon-right left"></text>
					<text v-else class="cuIcon-appreciate icon-right left"></text>
					<text>点赞</text>
				</view>
				<view class="footer-item center" @tap="collection()">
					<text v-if="article.collection" class="cuIcon-likefill fill icon-right"></text>
					<text v-else class="cuIcon-like icon-right"></text>
					<text>收藏</text>
				</view>
				<view class="footer-item" @tap="share">
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
		data() {
			return {
				typeIndex: -1,
				listIndex: -1,
				isIndex: false,
				baseURL: ArticleURL,
				webviewStyles: {
					progress: {
						color: '#F76454'
					}
				}
			}
		},
		computed: {
			article() {
				if (this.isIndex) {
					return this.$store.state.article.index
				} else {
					return this.$store.state.article.lists[this.typeIndex][this.listIndex]
				}
			},
			title() {
				return this.article.type === 1 ? '视频详情' : '文章详情'
			}
		},
		onLoad(opt) {
			if (opt.fromIndex) { // 是否是从首页的文章点进来的
				this.isIndex = true
			} else {
				this.typeIndex = +opt.type
				this.listIndex = +opt.index
				console.log(this.article.id)
			}
			setTimeout(() => console.log(this.article), 1234)
			this.$offset('.webview').then(res => {
				setTimeout(() => {
					this.$mp.page.$getAppWebview().children()[0].setStyle({ top: res.top, height: res.height })
				}, 345)
			})
		},
		onBackPress() { // 返回时收起分享
			if (uni._SHARE && uni._SHARE.isVisible()) {
				uni._MASK.hide()
				uni._SHARE.hide()
				return true
			}
		},
		methods: {
			like() { // 点赞
				if (this.isIndex) {
					this.$store.commit('article/LIKEINDEX')
				} else {
					this.$store.commit('article/LIKE', { listsIndex: this.typeIndex, commuIndex: this.listIndex })
				}
			}, 
			collection() { // 收藏
				if (this.isIndex) {
					this.$store.commit('article/COLLECTIONINDEX')
				} else {
					this.$store.commit('article/COLLECTION', { listsIndex: this.typeIndex, commuIndex: this.listIndex })
				}
			},
			share() {
				_share({
					type: 0,
					title: this.article.title,
					summary: this.article.summary,
					imageUrl: this.article.imgurl[0],
					href: ArticleURL + '?id=' + this.article.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.article-detail {
		@include page();
		.content {
			@include flex(column);
			background: #FFFFFF;
			.article-header {
				width: 100%;
				padding: 0 30rpx;
				box-sizing: border-box;
			}
			.webview {
				flex: 1;
				width: 100%;
			}
			.article-footer {
				width: 100%;
				height: 88rpx;
			}
		}
	}
</style>
