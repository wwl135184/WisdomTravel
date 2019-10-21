//index.js

//获取应用实例
const app = getApp();

//amap-wx.js
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun;

Page({
	data: {
		//地图经纬度
		longitude: '',
		latitude: '',
		iconPath: '../../assets/images/location-two.png',
		width: 28,
		height: 28,
		markers: [],
		//动画
		animation: {},
		inputAnimation: {},
		cancelBool: false, //取消
		//搜索信息
		addressinfo: '',
		tips: [],
		//天气信息
		weatherData: {}
	},
	onLoad() {
		myAmapFun = new amapFile.AMapWX({
			key: '75a3a42f7f2204c53e83bbd82987ece5'
		});
		//地图初始化
		this.getInitLocationFun();
		//天气信息
		this.getWeatherData();
	},
	onShow() {
		
	},
	//页面位置信息
	getInitLocationFun() {
		const that = this;
		myAmapFun.getRegeo({
			success: (data) => {
				var mks = [];
				var mksObj = {};
				mksObj['longitude'] = data[0].longitude;
				mksObj['latitude'] =  data[0].latitude;
				mksObj['iconPath'] = this.data.iconPath;
				mksObj['width'] = this.data.width;
				mksObj['height'] = this.data.height;
				mks.push(mksObj);
				that.setData({
					markers: mks
				});
				that.setData({
					longitude: data[0].longitude,
					latitude: data[0].latitude
				});
			},
			fail: (info) => {
				console.log(info);
			}
		})
	},
	//页面动画
	animationStartFun() {
		this.animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		this.animation.height(440).step();
		this.setData({
			animation: this.animation.export()
		})
		//判断input有没有默认信息
		if(this.data.addressinfo != '') {
			this.addressAnalysis(this.data.addressinfo);
		}
	},
	animationEndFun() {
		this.animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease-out',
		})
		this.animation.height(68).step();
		this.setData({
			animation: this.animation.export()
		})
	},
	inputWidthStartFun() {
		this.inputAnimation = wx.createAnimation({
			duration: 200,
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
		}, 350)
	},
	inputWidthEndFun() {
		this.inputAnimation = wx.createAnimation({
			duration: 200,
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
	//取消
	animationInputEnd() {
		this.setData({
			tips: [],
			addressinfo: ''
		})
		this.inputWidthEndFun();
		this.animationEndFun();
	},
	//地址信息检索
	addressInfoSearch(e) {
		this.addressAnalysis(e.detail.value);
	},
	addressAnalysis(keywords) {
		const that = this;
		myAmapFun.getInputtips({
			keywords: keywords,
			success: (data) => {
				//console.log(data.tips);
				that.setData({
					tips: data.tips
				})
			},
			fail: (info) => {
				console.log(info);
			}
		})
	},
	//地点选择
	addressLocation(e) {
		const location = e.currentTarget.dataset.location;
		const addressName = e.currentTarget.dataset.name;
		this.setData({
			addressinfo: addressName
		})
		const longitude = location.split(',')[0];
		const latitude = location.split(',')[1];
		var mks = [];
		var mksObj = {};
		mksObj['longitude'] = location.split(',')[0];
		mksObj['latitude'] =  location.split(',')[1];
		mksObj['iconPath'] = this.data.iconPath;
		mksObj['width'] = this.data.width;
		mksObj['height'] = this.data.height;
		mks.push(mksObj);
		this.setData({
			longitude: longitude,
			latitude: latitude,
			markers: mks
		});
		this.selectAddress();
	},
	selectAddress() {
		this.setData({
			tips: []
		})
		this.inputWidthEndFun();
		this.animationEndFun();
	},
	//天气信息
	getWeatherData() {
		const that = this;
		myAmapFun.getWeather({
			success: (data) => {
				//console.log(data);
				var wt = {};
				wt['city'] = data.liveData.city;
				wt['weather'] = data.liveData.weather;
				wt['temperature'] = data.liveData.temperature;
				wt['time'] = data.liveData.reporttime;
				wt['humidity'] = data.liveData.humidity;
				this.setData({
					weatherData: wt
				})
 			},
			fail: (info) => {
				console.log(info);
			}
		})
	}
})
