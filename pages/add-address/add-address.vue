<template>
	<view class="add-address">
		<custom-nav ref="ltm" :title="title" />
		<w-picker ref="Selector" mode="region" :defaultVal="pickerDefaultVal" themeColor="#F76454" @confirm="onConfirm" />
		<view class="content">
			<view class="app-item">
				<text>名字</text>
				<input type="text" v-model="address.name" placeholder="请填写真实姓名" />
			</view>
			<view class="app-item">
				<text>手机号</text>
				<input type="number" v-model="address.phone" maxlength="11" placeholder="请填写手机号码" />
			</view>
			<view class="app-item" @tap="choosePicker">
				<text>所在地区</text>
				<input type="text" v-model="address.local" disabled placeholder="请选择所在地区" />
				<text class="cuIcon-right"></text>
			</view>
			<view class="app-item">
				<text>详细地址</text>
				<textarea v-model="address.detail" :auto-height="true" placeholder="请填写详细地址" />
			</view>
			<view class="big-btn bg" @tap="save">保存地址</view>
		</view>
	</view>
</template>

<script>
	import WPicker from '@/components/w-picker/w-picker.vue'
	import cityData from '@/components/citypicker/city-data/city.js'
	import areaData from '@/components/citypicker/city-data/area.js'
	import cityPicker from '@/components/citypicker/city-picker.vue'
	import provinceData from '@/components/citypicker/city-data/province.js'
	import { _API_AddressAdd, _API_AddressUpdata } from '@/apis/address.js'
	export default {
		components: { WPicker, cityPicker },
		data() {
			return {
				title: '新增地址',
				id: '',
				address: {
					name: '',
					phone: '',
					local: '',
					provice: '',
					city: '',
					area: '',
					detail: ''
				},
				requesting: false,
				pickerDefaultVal: ['河南省', '郑州市', '金水区']
			}
		},
		computed: {
			list() { return this.$store.state.address.list }
		},
		methods: {
			save() { // 保存/修改地址
				if (!this.address.name.match(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/)) { // 校验姓名
					this.$refs.ltm.toast('真实姓名不符合要求')
					return
				}
				if (!this.address.phone.match(/^1\d{10}$/)) { // 校验手机号
					this.$refs.ltm.toast('手机号码不符合要求')
					return
				}
				if (!this.address.local.trim().length) { // 校验是否选择地区
					this.$refs.ltm.toast('请选择所在地区')
					return
				}
				if (!this.address.detail.trim().length) { // 校验是否填写详细地址
					this.$refs.ltm.toast('详细地址不能为空')
					return
				}
				const address = {
					con_name: this.address.name,
					con_mobile: this.address.phone,
					provice: this.address.provice,
					city: this.address.city,
					area: this.address.area,
					address: this.address.detail
				}
				if (!this.requesting) {
					this.requesting = true
					this.$refs.ltm.loading()
					if (this.title === '新增地址') {
						_API_AddressAdd(address).then(res => {
							uni.navigateBack()
							uni.$emit('ADDRESS', '新增地址成功')
						})
					} else if (this.title === '编辑地址') {
						address.id = this.id
						_API_AddressUpdata(address).then(res => {
							uni.navigateBack()
							uni.$emit('ADDRESS', '修改地址成功')
						})
					}
				}
			},
			choosePicker() { // 显示地址选择器
				this.$refs.Selector.show()
			},
			onConfirm(e) { // 选择地址选择器
				this.address.local = `${e.checkArr[0]}-${e.checkArr[1]}-${e.checkArr[2]}`
				this.address.provice = e.checkArr[0]
				this.address.city = e.checkArr[1]
				this.address.area = e.checkArr[2]
			}
		},
		onLoad(opt) {
			if (opt.index) { // 如果传入 index 表示用户编辑地址
				this.title = '编辑地址' // 修改页面标题
				const address = this.list[opt.index]
				this.id = address.id // 获取地址 id
				this.address.name = address.con_name
				this.address.phone = address.con_mobile
				this.address.provice = address.provice
				this.address.city = address.city
				this.address.area = address.area
				this.address.local = `${address.provice}-${address.city}-${address.area}`
				this.address.detail = address.address
				this.pickerDefaultVal = [address.provice, address.city, address.area]
			}
		}
	}
</script>

<style lang="scss">
	.add-address {
		@include page();
		.cuIcon-right {
			top: 50%;
			right: 30rpx; 
			position: absolute;
			transform: translateY(-50%);
		}
	}
</style>
