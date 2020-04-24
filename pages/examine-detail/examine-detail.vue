<template>
	<view class="examine-detail">
		<custom-nav ref="ltm" :title="title" />
		<w-picker ref="Selector" mode="selector" defaultVal="特级代理" themeColor="#F76454" :selectList="selectList"  @confirm="onConfirm" />
		<view class="content">
			<view class="examine-item">
				<view class="top">
					<view class="apply"> 申请人：{{ info.apply_name }} </view>
					<view class="invite">
						<text class="cuIcon-selection icon"></text>
						<text>邀请人：{{ info.invite_name }}</text>
					</view>
					<view class="time">
						<text class="cuIcon-time icon"></text>
						<text>申请时间：{{ info.apply_time }}</text>
					</view>
				</view>
				<view class="bot">
					<view class="left">
						<text class="name">状态：</text>
						<text class="basecolor">待审核</text>
					</view>
				</view>
			</view>
			<view class="app-item item item-space">
				<text>微信昵称</text>
				<text style="text-align: right;">{{ info.apply_name }}</text>
			</view>
			<view class="app-item item">
				<text>真实姓名</text>
				<text style="text-align: right;">{{ info.real_name }}</text>
			</view>
			<view class="app-item item">
				<text>身份证号</text>
				<text style="text-align: right;">{{ info.id_card_num }}</text>
			</view>
			<view class="app-item item">
				<text>联系方式</text>
				<text style="text-align: right;">{{ info.apply_phone }}</text>
			</view>
			<view class="app-item item level_name" @tap="chooseLevel">
				<text>代理等级</text>
				<view>
					<text>{{ info.level ? info.level : '请选择代理等级' }}</text>
					<text v-if="type === 0" class="cuIcon-right"></text>
				</view>
			</view>
			<view class="button">
				<view class="left big-btn" @tap="tapNoass">驳回</view>
				<view class="right big-btn bg" @tap="tapPass">通过</view>
			</view>
		</view>
		<view v-if="reject || animationKey" class="reject" @tap.stop="closeSheet">
			<view class="bottom-sheet" :class="reject ? 'moveIn' : 'moveOut'" @tap.stop="">
				<view class="top">
					<text>驳回原因</text>
					<text class="cuIcon-close" @tap="closeSheet"></text>
				</view>
				<view class="msg">若所邀请人填写信息与你线下沟通不符，请先进行联系确认 之后，再进行驳回申请</view>
				<view class="sheet-item" v-for="(item, index) in rejectReasonList" :key="index" @tap="chooseReason(index)">
					<view class="sheet-item-left">{{ item }}</view>
					<text v-if="index === choosedRejectReason" class="cuIcon-roundcheckfill basecolor"></text>
					<text v-else class="cuIcon-round"></text>
				</view>
				<view class="sheet-item" @tap="chooseReason(rejectReasonList.length)">
					<view class="sheet-item-left">
						其他：<input type="text" v-model="rejectReason" maxlength="12" placeholder="请输入驳回原因(12字以内)" />
					</view>
					<text v-if="rejectReasonList.length === choosedRejectReason" class="cuIcon-roundcheckfill basecolor"></text>
					<text v-else class="cuIcon-round"></text>
				</view>
				<view class="bot">
					<view class="left big-btn" @tap="closeSheet">暂不驳回</view>
					<view class="right big-btn bg" @tap="tapReject">驳回申请</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { _API_Examine } from '@/apis/team.js'
	import WPicker from '@/components/w-picker/w-picker.vue'
	export default {
		components: { WPicker },
		data() {
			return {
				title: '审核详情',
				type: 0, // 0 邀请人审核 1 上级审核
				index: 0,
				info: {},
				selectList: [
					{ label: '特级代理', value: '1' },
					{ label: '顶级代理', value: '2' },
					{ label: '皇冠代理', value: '3' },
				],
				reject: false,
				animationKey: false,
				rejectReasonList: [
					'微信昵称填写错误',
					'与线下沟通情况不符',
					'真实姓名填写错误'
				],
				rejectReason: '',
				choosedRejectReason: -1
			}
		},
		onLoad(opt) {
			this.type = +opt.type
			this.index = opt.index
			this.info = JSON.parse(opt.data)
		},
		methods: {
			chooseLevel() { // 点击选择等级
				if (this.type === 0) {
					this.$refs.Selector.show()
				}
			},
			onConfirm(e) { // 邀请人选择等级
				this.info.level = e.checkArr.label
				this.info.levelID = e.checkArr.value
			},
			tapNoass() { // 点击驳回
				this.reject = true
				this.animationKey = true
			},
			chooseReason(index) { // 选择驳回原因
				this.choosedRejectReason = index
			},
			tapPass() { // 点击通过
				if (!this.info.levelID && this.type === 0) {
					this.$refs.ltm.toast('请选择注册用户的代理等级')
					return
				}
				this.$refs.ltm.modal('提示', ['确定要通过注册申请？']).then(() => {
					this.$refs.ltm.loading()
					_API_Examine({ type: this.type ? 'up' : 'invite', action: 'pass', id: this.info.id, level: this.info.levelID }).then(() => {
						uni.$emit('EXAMINEPASS', this.type, this.index) // 广播通过
						uni.navigateBack()
					})
				}).catch(() => {
					this.$refs.ltm.toast('取消通过')
				})
			},
			tapReject() { // 驳回
				if (this.rejectReason || (this.choosedRejectReason > -1 && this.choosedRejectReason < this.rejectReasonList.length)) {
					uni.hideKeyboard() // 收起键盘
					const reason = this.rejectReason ? this.rejectReason : this.rejectReasonList[this.choosedRejectReason]
					setTimeout(() => {
						this.$refs.ltm.modal('提示', ['确定要驳回注册申请？']).then(() => {
							this.reject = false
							this.$refs.ltm.loading()
							_API_Examine({ type: this.type ? 'up' : 'invite', action: 'reject', id: this.info.id, reason }).then(() => {
								uni.$emit('EXAMINEREJECT', this.type, this.index, reason) // 广播驳回
								uni.navigateBack()
							})
						}).catch(() => {
							this.$refs.ltm.toast('取消驳回')
						})
					}, 333)
				} else {
					this.$refs.ltm.toast('请输入驳回原因', 'bottom')
				}
			},
			closeSheet() { // 关闭驳回弹窗
				this.reject = false
				setTimeout(() => {
					this.animationKey = false
				}, 200)
			}
		}
	}
</script>

<style lang="scss">
	.examine-detail {
		@include page();
		.content {
			.examine-item {
				height: 270rpx;
				margin-top: 10rpx;
				background: #FFFFFF;
				position: relative;
				.top {
					@include flex(column);
					height: 180rpx;
					padding: 30rpx;
					box-sizing: border-box;
					border-bottom: 1rpx solid $app-base-bg;
					>view {
						flex: 1;
						width: 100%;
						font-size: 26rpx;
						color: $app-sec-text-color;
						&.apply {
							font-size: 32rpx;
							margin-bottom: 16rpx;
							color: $app-main-text-color;
						}
						&.invite, &.time {
							line-height: 44rpx;
							.icon { 
								font-size: 32rpx;
								margin-right: 20rpx;
								color: $app-base-color;
							}
						}
					}
				}
				.bot {
					@include flex();
					height: 90rpx;
					padding: 30rpx;
					font-size: 32rpx;
					box-sizing: border-box;
					
					justify-content: space-between;
					.left {
						flex: 1;
						@include flex();
						justify-content: flex-start;
						.status {
							color: $app-sec-text-color;
						}
						.reject {
							font-size: 26rpx;
							margin-left: 20rpx;
						}
					}
				}
				.ispass {
					top: 20rpx;
					width: 85rpx;
					right: 30rpx;
					height: 58rpx;
					position: absolute;
				}
			}
			.level_name {
				.picker {
					@include flex();
					height: 90rpx;
					text-align: right;
					justify-content: flex-end;
				}
			}
			.button {
				@include flex();
				height: 88rpx;
				margin-top: 99rpx;
				justify-content: space-around;
				view {
					width: 240rpx;
					border-radius: 10rpx;
				}
			}
		}
		.reject {
			@include flex();
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			position: fixed;
			align-items: flex-end;
			background: rgba(0, 0, 0, .4);
			.bottom-sheet {
				@include flex(column);
				width: 100%;
				background: #FFFFFF;
				border-radius: 20rpx 20rpx 0 0;
				&.moveIn {
					animation: move-in .2s;
					animation-fill-mode: forwards;
				}
				&.moveOut {
					animation: move-out .2s;
					animation-fill-mode: forwards;
				}
				.top {
					@include flex();
					width: 100%;
					height: 80rpx;
					font-size: 32rpx;
					position: relative;
					.cuIcon-close {
						@include flex();
						top: 0;
						right: 0;
						height: 100%;
						width: 110rpx;
						position: absolute;
					}
				}
				.msg {
					height: 90rpx;
					font-size: 26rpx;
					background: #F2F2F2;
					padding: 14rpx 30rpx;
					box-sizing: border-box;
				}
				.sheet-item {
					@include flex();
					width: 100%;
					height: 74rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
					justify-content: space-between;
					border-bottom: 1px solid #F2F2F2;
					.sheet-item-left {
						@include flex();
						flex: 1;
						justify-content: flex-start;
						input {
							flex: 1;
						}
					}
				}
				.bot {
					@include flex();
					width: 100%;
					height: 124rpx;
					justify-content: space-around;
					view {
						margin: 0;
						width: 185rpx;
						height: 68rpx;
					}
				}
			}
		}
	}
	@keyframes move-in {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes move-out {
		0% {
			transform: translateY(0%);
		}
		100% {
			transform: translateY(100%);
		}
	}
</style>
