Component({
	pageLifetimes: {
		show: function() {
			this.animationEndFun();
		}
	},
	lifetimes: {
		created() {
		},
		attached() {
			this.animationEndFun();
		}
	},
	data: {
		animationComponent: {},
	},
	methods: {
		//页面动画
		animationEndFun() {
			this.animationComponent = wx.createAnimation({
				duration: 600,
				timingFunction: 'ease',
			})
			this.animationComponent.height(162).step();
			this.setData({
				animationComponent: this.animationComponent.export()
			})
		},
	}
})