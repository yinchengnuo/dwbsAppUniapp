<template>
	<view class="apply-return">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="app-item">
				<text>申请人</text>
				<text>{{ name || $store.state.userinfo.nickname }}</text>
			</view>
			<view class="app-item">
				<text>代理等级</text>
				<text>{{ level }}</text>
			</view>
			<view class="app-item">
				<text>联系方式</text>
				<text>{{ phone }}</text>
			</view>
			<view class="app-item item-space">
				<text>退货数量</text>
				<text class="basecolor">￥{{ num | numDot }}.00</text>
			</view>
			<view class="app-item">
				<text>退货价值</text>
				<text class="basecolor">￥{{ price | numDot }}.00</text>
			</view>
			<view class="big-btn bg" @tap="submit">提交单据</view>
		</view>
	</view>
</template>

<script>
	import { _API_OrderStorage } from '@/apis/order.js'
	import { _API_TeamPerData } from '@/apis/team.js'
	export default {
		data() {
			return {
				title: '申请退货',
				name: '',
				level: this.$store.state.userinfo.level,
				phone: this.$store.state.userinfo.mobile,
				num: 0,
				price: 0
			}
		},
		mounted() {
			this.$refs.ltm.loading()
			_API_TeamPerData({ id: this.$store.state.userinfo.id }).then(res => {
				this.name = res.data.real_name
				_API_OrderStorage().then(res => {
					this.num = res.data.list.reduce((t, e) => e.typeList.reduce((tt, ee) => ee.num.reduce((ttt, eee) => ttt + Number(eee), tt), t), 0)
					this.price = res.data.list.reduce((t, e) => e.typeList.reduce((tt, ee) => ee.num.reduce((ttt, eee) => ttt + Number(eee) * Number(e.price), tt), t), 0)
				})
			})
		},
		methods: {
			submit() {
				this.$refs.ltm.modal('提示', ['提交单据审核通过后，您将收到退款并永久退出大卫博士？']).then(() => {
					this.$refs.ltm.loading()
					uni.navigateBack()
				}).catch(() => {
					this.$refs.ltm.toast('取消提交')
				})
			}
		}
	}
</script>

<style lang="scss">
	.apply-return {
		@include page();
	}
</style>
