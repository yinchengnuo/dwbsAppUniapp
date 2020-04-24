<template>
	<view class="phone-area">
		<custom-nav :title="title" />
		<view class="content">
			<scroll-view scroll-y :style="{ height: scrollviewHeight + 'px' }" :scroll-into-view="'item'+ itemName" :scroll-with-animation="true" :enable-back-to-top="true">
				<view class="list-item" v-for="(item, index) in list" v-if="item.list.length" :key="index" :id="'item' + item.name">
					<view class="name">{{ item.name }}</view>
					<view class="item" v-for="(codeItem, codeIndex) in item.list" :key="codeIndex" @tap="chooseCode(codeItem.name, codeItem.code)">
						<text>{{ codeItem.name }}</text>
						<text class="code">{{ codeItem.code }}</text>
					</view>
				</view>
			</scroll-view>
			<view class="chooseIndex" @touchstart="tMove" @touchmove.stop="tMove" @touchend="tEnd">
				<view class="chooseIndex-item" v-for="(item, index) in list" :key="index" :id="'indexes-' + item.name">
					{{ item.name }}
				</view>
			</view>
			<view v-if="isShowChar" class="showChar">{{ showChar }}</view>
		</view>
	</view>
</template>

<script>
	import areaList from '@/common/util/phone-area.js'
	export default {
		data() {
			return {
				title: '选择国家/地区',
				scrollviewHeight: 0,
				list: areaList,
				itemName: '',
				chooseBar: {},
				isShowChar: false,
				showChar: ''
			}
		},
		mounted() { // 设置scrollview 高
			this.$offset('.content').then(res => this.scrollviewHeight = res.height) // 设置scrollview 高
			this.$offset('.chooseIndex').then(res => this.chooseBar = res) // 获取chooseBar高度
		},
		methods: {
			tMove(e) { // chooseBar touch 事件开始
				this.isShowChar = true
				if (e.touches[0].clientY >= this.chooseBar.top && e.touches[0].clientY <= this.chooseBar.bottom) {
					this.itemName = this.showChar = this.list[Math.floor(((e.touches[0].clientY - this.chooseBar.top) / this.chooseBar.height) * 26)].name
				}
			},
			tEnd() { // chooseBar touch 事件结束
				this.isShowChar = false;
			},
			chooseCode(name, code) { // 选择代码
				uni.$emit('CHOOSEPHONECODE', name, code === 86 ? code + '' : '+' + code)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.phone-area {
		@include page();
		.content {
			scroll-view {
				background: #FFFFFF;
				.list-item {
					.name {
						@include flex();
						height: 48rpx;
						font-size: 32rpx;
						padding: 0 30rpx;
						position: sticky;
						box-sizing: border-box;
						background: $app-base-bg;
						justify-content: flex-start;
					}
					.item {
						@include flex();
						height: 88rpx;
						box-sizing: border-box;
						padding: 0 100rpx 0 30rpx;
						justify-content: space-between;
						border-bottom: 1rpx solid $app-base-bg;
						.code {
							color: #42b983;
							padding: 10rpx 20rpx;
							border-radius: 8rpx;
							border: 1rpx solid #1AAD19;
						}
					}
				}
			}
			.chooseIndex {
				@include flex(column);
				top: 50%;
				right: 30rpx;
				width: 30rpx;
				height: 780rpx;
				position: fixed;
				background: #FFFFFF;
				border-radius: 8rpx;
				transform: translateY(-50%);
				box-shadow: 0rpx 0rpx 1rpx 1rpx #666666;
				.chooseIndex-item {
					@include flex();
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
				}
			}
			.showChar {
				@include flex();
				top: 50%;
				left: 50%;
				z-index: 1;
				width: 123rpx;
				height: 123rpx;
				color: #FFFFFF;
				position: fixed;
				font-size: 88rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, .3);
				transform: translate(-50%, -50%);
			}
		}
	}
</style>
