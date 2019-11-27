//index.js

//获取应用实例
const app = getApp();

//高德地图amap-wx.js
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun;

//腾讯地图
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
	data: {
		//位置信息
		longitude: '',
		latitude: '',
		iconPath: '../../assets/images/marker.png',
		width: 22,
		height: 32,
		markers: [],
		scale: 16,
		//搜索弹出框动画
		animation: {},
		inputAnimation: {},
		cancelBool: false, //取消
		//搜索信息
		addressinfo: '',
		tips: [],
		//键盘收起判断
		heightBool: false,
		//天气信息
		weatherInfoBool: false,
		weatherData: {},
		//地图设置
		mapSetShowBool: false,
		mapSetShowAnimation: {},
		operationBool: false,
		mapSetAnimation: {},
		mapChangeBool: false,
		//交通状况
		trafficCondition: false,
		//线路信息
		location: '',
		address: '',
		routePlanShowBool: false,
		routePlanAnimation: {},
		polyline: [],
		mapInitBool: true,
	},
	onLoad() {
		wx.showLoading({
		  title: '初始化',
		})
		//高德地图
		myAmapFun = new amapFile.AMapWX({
			key: '75a3a42f7f2204c53e83bbd82987ece5'
		});
		//腾讯地图
		qqmapsdk =  new QQMapWX({
            key: '5YKBZ-677WR-45BWG-WEOT6-X3UCV-PVB5T'
        });
		this.qqmapTest();
		//天气信息
		this.getWeatherData();
		//地图初始化
		this.getInitLocationFun();
	},
	onShow() {
		
	},
	//位置信息初始化
	getInitLocationFun() {
		const that = this;
		myAmapFun.getRegeo({
			success: (data) => {
				wx.hideLoading();
				var mks = [];
				var mksObj = {};
				mksObj['longitude'] = data[0].longitude;
				mksObj['latitude'] =  data[0].latitude;
				mksObj['iconPath'] = this.data.iconPath;
				mksObj['width'] = this.data.width;
				mksObj['height'] = this.data.height;
				mks.push(mksObj);
				that.setData({
					markers: mks,
					longitude: data[0].longitude,
					latitude: data[0].latitude
				});
			},
			fail: (info) => {
				console.log(info);
			}
		})
	},
	//腾讯地图测试
	qqmapTest() {
		qqmapsdk.search({
			keyword: '酒店',
			success: (res) => {
				//console.log(res);
			},
			fail: (err) => {
				conosle.log(err);
			}
		})
	},
	//搜索弹出框动画
	animationStartFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		animation.height(440).step();
		this.setData({
			animation: animation.export()
		})
		//判断input有没有默认信息
		if(this.data.addressinfo != '') {
			this.addressAnalysis(this.data.addressinfo);
		}
	},
	animationEndFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease-out',
		})
		animation.height(68).step();
		this.setData({
			animation: animation.export(),
			heightBool: false
		})
	},
	inputWidthStartFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		});
		animation.width(273).step();
		this.setData({
			inputAnimation: animation.export(),
		})
		setTimeout(() => {
			this.setData({
				cancelBool: true,
			})
		}, 350)
	},
	inputWidthEndFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
		})
		animation.width(315).step();
		this.setData({
			cancelBool: false,
			inputAnimation: animation.export()
		})
	},
	//地址搜索
	animationInputStart() {
		this.setData({
			heightBool: true
		})
		this.animationStartFun();
		this.inputWidthStartFun();
	},
	//取消
	animationInputEnd() {
		//地图初始化
		if(this.data.addressinfo != '') {
			this.getInitLocationFun();
		}
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
		if(e.detail.value != '') {
			this.setData({
				heightBool: false
			})
		} else {
			this.setData({
				heightBool: true
			})
		}
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
			address: addressName,
			location: location,
			longitude: longitude,
			latitude: latitude,
			markers: mks
		});
		const to = {};
		to['longitude'] = location.split(',')[0];
		to['latitude'] = location.split(',')[1];
		this.routeInformation(to);
		this.selectAddress();
	},
	selectAddress() {
		this.setData({
			tips: [],
			routePlanShowBool: true,
		})
		this.inputWidthEndFun();
		this.animationEndFun();
		//路径规划
		this.routePlanStartFun();
	},
	//路线规划->wx插件
	routeInfo(name, latitude, longitude) {
		let plugin = requirePlugin("routePlan");
		let key = '5YKBZ-677WR-45BWG-WEOT6-X3UCV-PVB5T';
		let referer = "WisdomTravel";
		let endPoint = JSON.stringify({
			'name': name,
			'latitude': latitude,
			'longitude': longitude
		});
		wx.navigateTo({
			url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
		})
	},
	//路线规划
	routePlanStartFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease'
		})
		animation.height(158).step();
		this.setData({
			routePlanAnimation: animation.export()
		})
	},
	routePlanEndFun() {
		const animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease'
		})
		animation.height(0).step();
		this.setData({
			routePlanAnimation: animation.export(),
			routePlanShowBool: false,
			polyline: [],
			scale: 16
		})
		this.getInitLocationFun();
	},
	//wx-jssdk->开车
	routeInformation(to) {
		const _this = this;
		qqmapsdk.direction({
			mode: 'driving',
			to: to,
			success: res => {
				//console.log(res);
				var ret = res;
				var coors = ret.result.routes[0].polyline, pl = [];
				var kr = 1000000;
				for(var i = 2; i < coors.length; i++) {
					coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
				}
				for(var i = 0; i < coors.length; i += 2) {
					pl.push({ latitude: coors[i], longitude: coors[i + 1] })
				}
				var obj = {};
				var polylineData = [];
				obj['points'] = pl;
				obj['color'] = '#00c39c';
				obj['width'] = 8;
				polylineData.push(obj);
				_this.setData({
					latitude: pl[0].latitude,
					longitude: pl[0].longitude,
					polyline: polylineData,
					scale: 12
				})
			},
			fail: err => {
				console.log(err);
			},
			complete: res => {
				console.log(res);
			}
		})
	},
	//获取天气信息
	getWeatherData() {
		const that = this;
		myAmapFun.getWeather({
			success: (data) => {
				//console.log(data);
				var wt = {};
				wt['city'] = data.liveData.city;
				wt['weather'] = data.liveData.weather;
				wt['temperature'] = data.liveData.temperature;
				//wt['time'] = data.liveData.reporttime;
				wt['humidity'] = data.liveData.humidity;
				wt['winddirection'] = data.winddirection.data;
				wt['windpower'] = data.windpower.data;
				this.setData({
					weatherData: wt,
					weatherInfoBool: true
				})
			},
			fail: (info) => {
				console.log(info);
			}
		})
	},
	//键盘收起判断
	pageBindtap() {
		if(this.data.addressinfo == '' && this.data.heightBool) {
			this.inputWidthEndFun();
			this.animationEndFun();
		}
	},
	//地图设置弹出动画
	mapSetAnimationFun() {
		if(!this.data.heightBool && !this.data.routePlanShowBool) {
			this.setData({
				mapSetShowBool: true,
			})
			const animation = wx.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			})
			animation.height(166).step();
			this.setData({
				mapSetAnimation: animation.export()
			})
		}
	},
	mapSetClose() {
		const animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease'
		})
		animation.height(0).step();
		this.setData({
			mapSetAnimation: animation.export(),
		})
		setTimeout(() => {
			this.setData({
				mapSetShowBool: false
			})
		}, 350)
	},
	//地图、卫星切换
	mapChange(e) {
		const index = e.detail;
		if(index == '1') {
			this.setData({
				mapChangeBool: true
			})
		} else {
			this.setData({
				mapChangeBool: false
			})
		}
	},
	//交通状况
	trafficCondition(e) {
		this.setData({
			trafficCondition: e.detail
		})
	},
})
