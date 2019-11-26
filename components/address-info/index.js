//腾讯地图
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Component({
	properties: {
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
			//位置信息
			this.getAddressInfoData();
		},
		detached() {
			
		}
	},
	data: {
		//地址信息
		addressInfoData: {},
	},
	methods: {
		//位置信息
		getAddressInfoData() {
			var _this = this;
			console.log(this.location);
			qqmapsdk.reverseGeocoder({
				location: _this.location,
				success: res => {
					console.log(res);
				},
				fail: (err) => {
					console.log(err);
				}
			})
		}
	}
})