module.exports = {
	methods: {
		navTo(url, data){
			if(!this.vuex_hasLogin){
				url = '/pages/login/login';
			}
			
			uni.$u.route(url,data);
		},
		navToView(url, data){
			uni.$u.route(url,data);
		},
		
		
		
		// 分页加载数据,支持上拉加载
		/**
		 * url  : 请求地址
		 * data : 请求参数
		 * pageData: 分页参数
		 * type : 0 分页加载  1: 重新加载
		 */
		async loadPage(url,data,type=0){
			let that  = this;
			if(that.pageData){
				//没有更多直接返回
				if(type === 0 && that.pageData.loadType === 'nomore'){
					return;
				}
				else{
					if(that.pageData.pageIndex > 1){
						that.pageData.loadType = 'loading';
					}
					else{
						that.pageData.loadType = 'more'
					}
				}
				
			}
			
			if(type === 1){
				that.pageData.data = [];
				that.pageData.pageNo = 1;
			}
			
			data.pageNo = that.pageData.pageNo;
			data.pageSize = that.pageData.pageSize;
			
			let resultData = await uni.$u.post(url,data);
			
			if(resultData.data && resultData.data.pageNo){
				let pageNo = resultData.data.pageNo;
				let pageSize = resultData.data.pageSize;
				let pageCount = resultData.data.count;
				
				if(pageNo * pageSize >pageCount){
					that.pageData.loadType  = 'nomore';
				}else{
					that.pageData.pageNo += 1;
				}
			}
			
			that.pageData.data = that.pageData.data.concat(resultData.data.list);
		
			if(type === 1){
				uni.stopPullDownRefresh();
			}
		},
		
		async uploadFile(filePath,callback){
			uni.uploadFile({
				url: this.vuex_baseUrl+'/login/frontUploadFile',
				filePath: filePath,
				name: 'uploadFile',
				success: (res) => {
					
					if(res.data.result==false){
						uni.showToast({
						    title: res.data.message,
						    duration: 2000
						});
					}
					else{
						let resData =  JSON.parse(res.data);
						if(resData.uploadFiles.length == 0){
							uni.showToast({
							    title: "上传头像失败!",
							    duration: 2000
							});
						}
						callback(resData.uploadFiles);
					
					}
				}
				
			});
			
		}
	
	}  
}