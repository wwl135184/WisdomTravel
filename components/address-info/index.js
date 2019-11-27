//腾讯地图
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Component({
	properties: {
		//地点名称
		address: String,
		//经纬度
		location: String,
	},
	lifetimes: {
		created() {
			//腾讯地图
			qqmapsdk =  new QQMapWX({
			    key: '5YKBZ-677WR-45BWG-WEOT6-X3UCV-PVB5T'
			});
		},
		attached() {
			//地点名称
			this.getAddressName();
			//位置信息
			this.getAddressInfoData();
			//距离计算
			this.getAddressDistance();
		},
	},
	data: {
		//地点名称
		addressName: '',
		//地址信息
		addressInfo: '',
		//距离计算
		distance: null,
		//时间
		duration: null,
	},
	methods: {
		//地点名称
		getAddressName() {
			this.setData({
				addressName: this.properties.address
			})
		},
		//位置信息
		getAddressInfoData() {
			var _this = this;
			qqmapsdk.reverseGeocoder({
				location: {
					latitude: this.properties.location.split(',')[1],
					longitude: this.properties.location.split(',')[0]
				},
				success: res => {
					//console.log(res);
					const data = res.result;
					this.setData({
						addressInfo: data.address
					})
				},
				fail: (err) => {
					console.log(err);
				}
			})
		},
		//距离计算
		getAddressDistance() {
			var _this = this;
			const location =  this.properties.location.split(',')[1] + ',' + this.properties.location.split(',')[0];
			qqmapsdk.calculateDistance({
				mode: 'driving',
				to: location,
				success: res => {
					//console.log(res);
					const data = res.result.elements;
					const distance = parseFloat(data[0].distance / 1000).toFixed(2);
					const duration = parseInt(data[0].duration / 60);
					this.setData({
						distance: distance,
						duration: duration
					})
				},
				fail: (err) => {
					console.log(err);
				}
			})
		},
		//close
		close() {
			this.triggerEvent('routeClose');
		}
	}
})