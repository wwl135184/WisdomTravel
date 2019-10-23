Component({
	lifetimes: {
		created() {
			
		},
		attached() {
			
		}
	},
	data: {
		activeIndex: '0',
	},
	methods: {
		//关闭地图设置
		close() {
			this.triggerEvent('mapSetClose');
		},
		//地图、卫星切换
		mapChange(e) {
			let index = e.currentTarget.dataset.index;
			this.setData({
				activeIndex: index
			})
			this.triggerEvent('mapChange', index);
		},
		//交通状况
		trafficCondition(e) {
			const switchBool = e.detail.value;
			this.triggerEvent('trafficCondition', switchBool)
		}
	}
})