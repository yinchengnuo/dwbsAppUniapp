<script>
	import { FlashScreenUrl } from '@/common/util/request.js'
	export default {
		onLaunch() {
			uni.json = obj => console.log(JSON.stringify(obj, null, 2))
			plus.screen.lockOrientation('portrait-primary') // 锁定屏幕方向
			let t = 5 // 闪屏倒计时时长
			let timer;
			 uni.FLASHSCREEN = new plus.nativeObj.View('FlashScreen', // 绘制闪屏
				{ top:'0px', left:'0px', height:'100%', width:'100%' },
				[
					{tag:'img', id:'FlashScreenImgBG', src: '/static/flashscreen.png', position:{top:'0px',left:'0px',width:'100%',height:'100%'}},
					{tag:'img', id:'FlashScreenImg', src: FlashScreenUrl, position:{top:'0px',left:'0px',width:'100%',height:'100%'}},
					{tag:'rect', id:'rect', rectStyles: { color:'#FFFFFF', radius: '20px', borderColor: '#999999', borderWidth: '1px' }, position:{ right: '20px', bottom: '30px', width:'80px', height:'30px' }},
					{tag:'font', id:'font1', text:'跳过', textStyles:{ size: '16px', align: 'left' }, position:{ right: '20px', bottom: '30px', width:'65px', height:'30px' }},
					{tag:'font', id:'font2', text: t, textStyles:{ size: '16px', color: '#F76454' }, position:{ right: '20px', bottom: '30px', width:'40px', height:'30px' }}
				]
			)
			uni.FLASHSCREEN.addEventListener('click', e => { // 点击跳过关闭闪屏
				if ((e.pageX > (this.$store.state.device.screenWidth - 110)) && (e.pageY > (this.$store.state.device.screenHeight - 50))) {
					clearInterval(timer) // 取消定时器
					uni.FLASHSCREEN.hide() // 隐藏闪屏
					uni.HIDESCREENED = true // 标记状态（闪屏已结束）
					uni.$emit('HIDESCREEN') // 广播状态（闪屏已结束）
				}
			})
			uni.FLASHSCREEN.show() // 显示闪屏
			timer = setInterval(() => { // 显示倒计时
				if (t <= 0) {
					uni.FLASHSCREEN.hide() // 隐藏闪屏
					uni.HIDESCREENED = true // 标记状态（闪屏已结束）
					uni.$emit('HIDESCREEN') // 广播状态（闪屏已结束）
					clearInterval(timer) // 取消定时器
				}
				uni.FLASHSCREEN.drawText(t --, { right: '20px', bottom: '30px', width:'40px', height:'30px' }, { size: '16px', color: '#F76454' }, 'font2')
			}, 1000)
		},
		onShow() {
			console.log('onShow')
		},
		onHide() {
			console.log('onHide')
		}
	}
</script>

<style lang="scss">
	@import 'common/style/main.scss';  //引入 ColorUI 组件库主样式
	@import 'common/style/icon.scss';  //引入 ColorUI 组件库图标样式
	@import 'common/style/animation.scss';  //引入 ColorUI 组件库动画样式
	page {  //uniapp 中的 page 标签相当于 html 中的 body, 默认高度为 auto, 但是高度为 100% 更利于 app 布局,你也可以在 page 中设置一些全局样式,比如全局背景色
		height: 100%;
		background: #FFFFFF;
		color: $app-main-text-color;
	}
</style>
