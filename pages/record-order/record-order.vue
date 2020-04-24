<template>
	<view class="record-order">
		<custom-nav ref="ltm" :title="title" color @rTap="hisOrders">
			<text style="margin-right: 16px;">历史记录</text>
		</custom-nav>
		<w-picker ref="Selector" mode="selector" themeColor="#F76454" :selectList="typeList"  @confirm="onConfirm" />
		<view class="content">
			<view class="app-item picker" @tap="choosePicker">
				<text class="title">商品款式</text>
				<text class="name">{{ choosedIndex === -1 ? '请选择要录入商品名称' : typeList[choosedIndex].label }}</text>
				<text class="cuIcon-right"></text>
			</view>
			<view class="app-item">
				<text>数量</text>
				<custom-counter v-model="choosedNum" />
			</view>
			<view class="app-item item-space">
				<text>总计金额</text>
				<input type="number" maxlength="7" v-model="money" placeholder="请输入订单金额" />
			</view>
			<view class="big-btn bg" @tap="record">录入订单</view>
		</view>
	</view>
</template>

<script>
	import { _API_GoodList } from '@/apis/good.js'
	import { _API_FortuneRecordOrder } from '@/apis/fortune.js'
	import WPicker from '@/components/w-picker/w-picker.vue'
	import customCounter from '../../components/public/custom-counter.vue'
	export default {
		components: { WPicker, customCounter },
		data() {
			return {
				title: '零售录单',
				typeList: [], // 可选的商品列表
				choosedIndex: -1, // 当前已选类型下标
				choosedNum: 0, // 商品数量
				goodId: '', // 商品id
				typeId: '' ,// type id,
				money: '', // 订单金额
				requesting: false // 是否正在网路请求
			}
		},
		mounted() { // 获取商品列表
			this.$refs.ltm.loading()
			_API_GoodList().then(res => {
				console.log(JSON.stringify(res.data.list, null, 2))
				res.data.list.forEach(good => {
					good.type.forEach((typeName, typeIndex) => this.typeList.push({ 
						id: good.id,
						type_id: good.type_id[typeIndex],
						label: good.name + '-' + typeName,
						value: good.name + '-' + typeName
					}))
				})
			})
		},
		methods: {
			hisOrders() { // 点击历史记录
				uni.navigateTo({ url: `../record-record/record-record?id=${this.$store.state.userinfo.id}` })
			},
			choosePicker() { // 点击选择商品
				this.$refs.Selector.show()
			},
			onConfirm(e) { // 点击提交选择
				this.choosedIndex = e.defaultVal[0]
				this.goodId = e.checkArr.id
				this.typeId = e.checkArr.type_id
			},
			record() { // 点击录入订单
				if (this.choosedIndex === -1) {
					this.$refs.ltm.toast('请您选择要录入的商品类型')
					return
				}
				if (+this.choosedNum === 0) {
					this.$refs.ltm.toast('请您选择要录入的商品数量')
					return
				}
				if (+this.money === 0) {
					this.$refs.ltm.toast('请您输入订单金额')
					return
				}
				if (!this.requesting) {
					this.$refs.ltm.loading()
					this.requesting = true
					_API_FortuneRecordOrder({ id: this.goodId, type_id: this.typeId, num: this.choosedNum, total: this.money }).then(res => {
						this.requesting = false
						this.choosedIndex = -1
						this.choosedNum = 0
						this.typeId = ''
						this.goodId = ''
						this.money = ''
						this.$refs.ltm.modal('提示', ['录单成功'], 'noCancle')
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.record-order {
		@include page();
		.content {
			.picker {
				display: block;
				height: 90rpx;
				width: 750rpx;
				text-align: center;
				line-height: 90rpx;
				.title {
					float: left;
				}
				.cuIcon-right {
					float: right;
				}
			}
			.app-item {
				font-size: 26rpx;
			}
			.big-btn {
				width: 480rpx;
			}
			.num {
				color: $app-base-color;
			}
		}
	}
</style>
