export default function(shareInfo) {
	const num = 4
	const iconSize = 68
	const cancelHeight = 88
	const itemSize = 750 / num
	const px = plus.screen.resolutionWidth / 750
	const height = plus.screen.resolutionHeight
	const rpx = num => px * num + 'px'
	uni._MASK = new plus.nativeObj.View("MASK", { top: '0px', left: '0px', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.3)'})
	uni._SHARE = new plus.nativeObj.View("SHARE", { bottom: '0px', left: '0px', height: rpx(285.5), width: '100%', backgroundColor: '#FFFFFF' })
	uni._MASK.addEventListener("click", e => {
		uni._MASK.hide()
		uni._SHARE.hide()
	})
	uni._SHARE.draw([
		{
			tag:'font', 
			id:'SHARECANLEL', 
			text: '取消', 
			textStyles:{ size: rpx(32), align: 'center', verticalAlign: 'center' }, 
			position:{ bottom: '0px', left: '0px', width: '100%', height: rpx(cancelHeight) },
		},
		{
			tag:'rect', 
			id:'SHARECANLELLINE',
			rectStyles:{ color: '#B2B2B2' }, 
			position:{ bottom: rpx(cancelHeight), left: '0px', width: '100%', height: '1px' },
		},
		{
			tag: 'img',
			id: 'sharewx',
			src: '/static/icon/sharewx.png',
			position: {
				left: rpx((itemSize - iconSize) / 2),
				width: rpx(iconSize),
				height: rpx(iconSize),
				bottom: rpx(cancelHeight + 88)
			}
		},
		{
			tag: 'img',
			id: 'sharepyq',
			src: '/static/icon/sharepyq.png',
			position: {
				left: rpx((itemSize - iconSize) / 2 + itemSize),
				width: rpx(iconSize),
				height: rpx(iconSize),
				bottom: rpx(cancelHeight + 88)
			}
		},
		{
			tag: 'img',
			id: 'sharemore',
			src: '/static/icon/sharemore.png',
			position: {
				left: rpx((itemSize - iconSize) / 2 + itemSize * 2),
				width: rpx(iconSize),
				height: rpx(iconSize),
				bottom: rpx(cancelHeight + 88)
			}
		},
		{
			tag: 'font',
			id: 'sharewxtext',
			text: '分享好友', 
			textStyles:{ size: rpx(28), align: 'center', verticalAlign: 'center' },
			position:{ bottom: rpx(cancelHeight), left: '0px', width: rpx(itemSize), height: rpx(88) },
		},
		{
			tag: 'font',
			id: 'sharepyqtext',
			text: '分享朋友圈', 
			textStyles:{ size: rpx(28), align: 'center', verticalAlign: 'center' },
			position:{ bottom: rpx(cancelHeight), left: rpx(itemSize), width: rpx(itemSize), height: rpx(88) },
		},
		{
			tag: 'font',
			id: 'sharemoretext',
			text: '更多', 
			textStyles:{ size: rpx(28), align: 'center', verticalAlign: 'center' },
			position:{ bottom: rpx(cancelHeight), left: rpx(itemSize * 2), width: rpx(itemSize), height: rpx(88) },
		}
	])
	uni._SHARE.addEventListener("click", e => {
		if (e.screenY > height - cancelHeight * px) { // 点击取消
			uni._MASK.hide()
			uni._SHARE.hide()
		} else {
			if (e.clientX <= itemSize * px) { // 分享到微信聊天
				plus.nativeUI.showWaiting()
				uni.share({ provider: "weixin", scene: "WXSceneSession",
				    ...shareInfo,
				    success () {
				        plus.nativeUI.toast('分享成功')
						uni._MASK.hide()
						uni._SHARE.hide()
				    },
				    fail (err) {
				        const season = err.errMsg.split(',')[0].split(':')
				        plus.nativeUI.toast(`分享失败: ${season[season.length - 1]}`)
				    },
					complete() {
						plus.nativeUI.closeWaiting()
					}
				})
			} else if (e.clientX > itemSize * px && e.clientX <= (itemSize * 2 * px)) { // 分享到朋友圈
				plus.nativeUI.showWaiting()
				uni.share({ provider: "weixin", scene: "WXSenceTimeline",
				    ...shareInfo,
				    success () {
				        plus.nativeUI.toast('分享成功')
						uni._MASK.hide()
						uni._SHARE.hide()
				    },
				    fail (err) {
						const season = err.errMsg.split(',')[0].split(':')
				        plus.nativeUI.toast(`分享失败: ${season[season.length - 1]}`)
				    },
					complete() {
						plus.nativeUI.closeWaiting()
					}
				})
			} else if (e.clientX > (itemSize * 2 * px) && e.clientX <= (itemSize * 3 * px)) { // 分享到更多
				plus.share.sendWithSystem({ content: shareInfo.href })
			}
		}
	})
	uni._MASK.show()
	uni._SHARE.show()
}