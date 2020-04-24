<template>
	<view class="custom-nav" v-show="title" :class="{ transparent: transparent, hide: !title }">
		<navigator open-type="navigateBack" v-if="!noback" class="back" :class="bangs ? 'bangs' : ''" @tap="tapLeft">
			<text class="cuIcon-back"></text>
		</navigator>
		<view class="center" :class="bangs ? 'bangs' : ''" @tap="tapCenter">
			<text>{{ title }}</text>
		</view>
		<view class="right" :class="{ bangs: bangs, color: color }" @tap="tapRight">
			<slot></slot>
		</view>
		
		
		<view v-if="LOADING" class="loading" @tap.stop="">
			<view class="loading-wrapper">
				<text class="cuIcon-loading1"></text>
			</view>
		</view>
		
		<view v-if="modalShow" class="custom-modal" :class="modalShow && modalAsync ? 'in' : 'out'">
			<view class="modal" :class="modalShow && modalAsync ? 'in' : 'out'">
				<view class="title">{{ modalTitle }}</view>
				<view class="message">
					<view v-for="(item, index) in modalMessages" :key="index">{{ item }}</view>
				</view>
				<view class="btn">
					<text v-if="!modalNoCancel" @tap="modalCancel" class="cancel">取消</text>
					<text @tap="modalConfire" class="confire">确定</text>
				</view>
			</view>
		</view>
		
		<view v-if="toastMessage" class="custom-toast" :class="{ 'toast-in': toastMessage }" :style="{ top: toastTop ? toastTop : '50%' }">{{ toastMessage }}</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	const eventBUS = new Vue()
	export default {
		props: {
			color: String,
			title: String,
			noback: String,
			transparent: String
		},
		data() {
			return {
				LOADING: false,
				modalTitle: '', // 提示标题
				modalMessages: [], // 提示信息
				modalAsync: true, // 延迟消失
				modalShow: false, // 是否显示 modal
				modalNoCancel: false, // 是否显示取消按钮
				toastMessage: '', // toast 消息提示
				toastTop: '', // toast 位置
			}
		},
		computed: {
			bangs() { return this.$store.state.device.bangs }
		},
		created() {
			uni.$on('HIDELOADING', () => {
				this.hideLoading()
			})
			uni.$on('TOAST', (msg) => {
				this.toast(msg)
			})
			uni.$on('UPDATAAPP', path => {
				this.modal('提示', ['新版本已经下载成功，现在安装'], 'noCancel').then(() => {
					plus.runtime.install(path)
				})
			})
		},
		methods: {
			tapLeft() {
				this.$emit('lTap')
			},
			tapCenter() {
				this.$emit('cTap')
			},
			tapRight() {
				this.$emit('rTap')
			},
			loading() {
				this.LOADING = true
			},
			hideLoading() {
				this.LOADING = false
			},
			
			modalCancel() { // modal点击取消
				eventBUS.$emit('cancel')
			},
			modalConfire() { // modal点击确定
				eventBUS.$emit('confire')
			},
			modal(title, message, noCancel) { // 弹出 modal
				noCancel ? this.modalNoCancel = true : ''
				this.modalShow = true
				this.modalTitle = title
				this.modalMessages = message
				const that = this
				return new Promise((resolve, reject) => {
					eventBUS.$on('confire', () => {
						resolve()
						that.close()
					})
					eventBUS.$on('cancel', () => {
						reject()
						that.close()
					})
				})
			},
			close() { // 关闭 modal
				this.modalAsync = false
				setTimeout(e => {
					this.modalShow = false
					this.modalAsync = true
				}, 200)
			},
			toast(message, position) {
				if (position === 'bottom') {
					this.toastTop = '80%'
				}
				this.toastMessage = ''
				this.toastMessage = message
				setTimeout(() => this.toastTop = this.toastMessage = '', 2345);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-nav {
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		@include flex();
		position: fixed;
		font-size: 40rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		height: $app-nav-height;
		box-shadow: 0px 1px 0px 0px rgba(178, 178 ,178 ,1);
		&.transparent {
			box-shadow: none;
			background: transparent;
			border-top-color: transparent;
		}
		&.hide {
			height: 0!important;
			box-shadow: 0px 0px 0px 0px #FFFFFF;
		}
		.back {
			width: 88rpx;
			height: 100%;
			color: #333333;
			@include flex(column);
			justify-content: flex-end;
			text {
				margin-bottom: 24rpx;
			}
			&.bangs {
				text {
					margin-bottom: 12rpx;
				}
			}
		}
		.center {
			flex: 1;
			height: 100%;
			text {
				left: 50%;
				bottom: 24rpx;
				position: absolute;
				transform: translateX(-50%);
			}
			&.bangs {
				text {
					bottom: 12rpx;
				}
			}
		}
		.right {
			@include flex(column);
			height: 100%;
			width: 180rpx;
			font-size: 28rpx;
			padding-bottom: 28rpx;
			align-items: flex-end;
			box-sizing: border-box;
			justify-content: flex-end;
			color: $app-main-text-color;
			&.color {
				color: $app-base-color;
			}
			&.bangs {
				padding-bottom: 16rpx;
			}
		}
		.loading {
			@include flex();
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 666;
			position: fixed;
			.loading-wrapper {
				@include flex();
				top: 50%;
				left: 50%;
				width: 120rpx;
				height: 120rpx;
				color: #FFFFFF;
				font-size: 60rpx;
				position: absolute;
				border-radius: 8rpx;
				background: rgba(0, 0, 0, .6);
				transform: translate(-50%, -50%);
				text {
					animation: loading .6s infinite linear;
				}
			}
		}
		
		.custom-modal {
			@include flex();
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			position: fixed;
			background: rgba(1, 1, 1, .4);
			&.in {
				animation: bg-in .2s;
				animation-fill-mode: forwards;
			}
			&.out {
				animation: bg-out .2s;
				animation-fill-mode: forwards;
			}
			.modal {
				@include flex(column);
				width: 80%;
				min-height: 25%;
				border-radius: 8rpx;
				background: #FFFFFF;
				&.in {
					animation: modal-in .2s;
					animation-fill-mode: forwards;
				}
				&.out {
					animation: modal-out .2s;
					animation-fill-mode: forwards;
				}
				.title {
					@include flex();
					width: 100%;
					height: 100rpx;
					font-size: 42rpx;
					color: $app-base-color;
				}
				.message {
					@include flex(column);
					flex: 1;
					width: 100%;
					padding: 30rpx;
					font-size: 32rpx;
					box-sizing: border-box;
					border-top: 2rpx solid #EEEEEE;
					border-bottom: 2rpx solid #EEEEEE;
					view {
						@include flex();
						flex: 1;
						width: 100%;
						margin: 8rpx 0;
						text-align: center;
					}
				}
				.btn {
					@include flex();
					width: 100%;
					height: 100rpx;
					text {
						@include flex();
						flex: 1;
						height: 100%;
						font-size: 32rpx;
						color: $app-base-color;
						&.cancel {
							color: $app-sec-text-color;
							border-right: 2rpx solid #EEEEEE;
						}
					}
				}
			}
		}
		
		.custom-toast {
			top: 50%;
			left: 50%;
			z-index: 999;
			color: #FFFFFF;
			position: fixed;
			font-size: 28rpx;
			max-width: 730rpx;
			text-align: center;
			line-height: 42rpx;
			border-radius: 8rpx;
			padding: 10rpx 20rpx;
			background: rgba(0, 0, 0, .6);
			transform: translate(-50%, -50%);
			&.toast-in {
				animation: toast-in .2s;
				animation-fill-mode: forwards;
			}
		}
	}
	@keyframes loading {
		0% { transform: rotateZ(0deg); }
		100% { transform: rotateZ(360deg); }
	}

	@keyframes bg-in {
		0% { background: rgba(0, 0, 0, 0) }
		100% { background: rgba(0, 0, 0, .4) }
	}
	@keyframes bg-out {
		0% { background: rgba(0, 0, 0, .4) }
		100% { background: rgba(0, 0, 0, 0) }
	}
	@keyframes modal-in {
		0% { transform: scale(0, 0); }
		100% { transform: scale(1, 1); }
	}
	@keyframes modal-out {
		0% { transform: scale(1, 1); }
		100% { transform: scale(0, 0); }
	}
	@keyframes toast-in {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>
