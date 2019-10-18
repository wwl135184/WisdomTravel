//index.js
//获取应用实例
const app = getApp();
//引入amap-wx.js
let amapFile = require('../../libs/amap-wx.js');

Page({
	data: {
		//定位
		latitude: '',
		longitude: '',
		//动画
		animation: {},
		inputAnimation: {},
		cancelBool: false, //取消
		//搜索信息
		addressinfo: '',
		inputValue: '',
		tips: [],
	},
	onLoad() {
		this.getInitLocationFun();
	},
	onShow() {
		//this.animationFun();
	},
	//页面位置信息
	getInitLocationFun() {
		const that = this;
		let myAmapFun = new amapFile.AMapWX({
			key: '75a3a42f7f2204c53e83bbd82987ece5'
		});
		myAmapFun.getRegeo({
			success: (data) => {
				that.setData({
					latitude: data[0].latitude,
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
	//页面动画
	animationStartFun() {
		this.animation = wx.createAnimation({
			duration: 400,
			timingFunction: 'ease',
		})
		this.animation.height(280).step();
		this.setData({
			animation: this.animation.export()
		})
	},
	animationEndFun() {
		this.animation = wx.createAnimation({
			duration: 400,
			timingFunction: 'ease',
		})
		this.animation.height(68).step();
		this.setData({
			animation: this.animation.export()
		})
	},
	inputWidthStartFun() {
		this.inputAnimation = wx.createAnimation({
			duration: 400,
			timingFunction: 'ease',
		});
		this.inputAnimation.width(273).step();
		this.setData({
			inputAnimation: this.inputAnimation.export(),
		})
		setTimeout(() => {
			this.setData({
				cancelBool: true,
			})
		}, 400)
	},
	inputWidthEndFun() {
		this.inputAnimation = wx.createAnimation({
			duration: 100,
			timingFunction: 'ease',
		})
		this.inputAnimation.width(315).step();
		this.setData({
			cancelBool: false,
			inputAnimation: this.inputAnimation.export()
		})
	},
	//地址搜索
	animationInputStart() {
		this.animationStartFun();
		this.inputWidthStartFun();
	},
	animationInputEnd() {
		this.setData({
			tips: [],
			inputValue: ''
		})
		this.inputWidthEndFun();
		this.animationEndFun();
	},
	addressInfoSearch(e) {
		this.setData({
			addressinfo: e.detail.value
		})
		this.addressAnalysis(e.detail.value);
	},
	addressAnalysis(keywords) {
		const that = this;
		let myAmapFun = new amapFile.AMapWX({
			key: '75a3a42f7f2204c53e83bbd82987ece5',
		});
		myAmapFun.getInputtips({
			keywords: keywords,
			success: (data) => {
				//console.log(data.tips);
				that.setData({
					tips: data.tips
				})
			},
			fail: (info) => {
				wx.showModal({
					title: info.errMsg
				})
			}
		})
	},
	addressLocation(e) {
		let location = e.target.dataset.location;
		/* const latitude = location.split(',')[0];
		const longitude = location.split(',')[1];
		this.setData({
			latitude: latitude,
			longitude: longitude
		}); */
		this.animationInputEnd();
	}
})
