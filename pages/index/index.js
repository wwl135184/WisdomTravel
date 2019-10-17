//index.js
//获取应用实例
const app = getApp();
//引入amap-wx.js
let amapFile = require('../../libs/amap-wx.js');

Page({
	data: {
		latitude: '',
		longitude: '',
		animation: {},
	},
	onLoad() {
		this.getInitLocationFun();
	},
	onShow() {
		//this.animationFun();
	},
	getInitLocationFun() {
		const that = this;
		let myAmapFun = new amapFile.AMapWX({
			key: '75a3a42f7f2204c53e83bbd82987ece5'
		});
		myAmapFun.getRegeo({
			success: (data) => {
				that.setData({
					latitude: data[0].latitude
				});
				that.setData({
					longitude: data[0].longitude
				});
			},
			fail: (info) => {
				wx.showModal({
					title: info.errMsg
				})
			}
		})
	},
	animationFun() {
		this.animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease',
		})
		this.animation.translateY(-204).step();
		this.setData({
			animation: this.animation.export()
		})
	}
})
