<template>
	<view>
		<video :src="src" :title="title" :autoplay="true" :show-fullscreen-btn="true" direction="0"
			show-center-play-btn="true" style="display: none;"
			id="myVideo"  @fullscreenchange="fullScreen" controls @timeupdate = "onPlayerTimeupdate($event)">
		</video>
	</view>
</template>



<script>
	
	
	export default {
		data() {
			return {
				id:'',
				src:'',
				title:'',
				videoContext:{},
				gklog:0, //视频观看时长
				start :true,
				
			}
		},
		onLoad(option) {			
			this.id = option.id;
			this.src = option.src;
			this.title = option.title;
		},
		
		onReady: function (res) {
		    // 获取 video 上下文 videoContext 对象
		    this.videoContext = uni.createVideoContext('myVideo');
		    // 进入全屏状态
		    this.videoContext.requestFullScreen({direction:90});
			
		},
		
		methods: {
			
			fullScreen(event){				
						
				this.videoContext = uni.createVideoContext('myVideo');				
				if(!event.detail.fullScreen && this.start == true){	
					this.start = false;
					this.videoContext.requestFullScreen({direction:0});	
					this.videoContext.exitFullScreen();
					// plus.screen.lockOrientation('myVideo') 
					
					
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; 
					
					prevPage.brand =  this.gklog;
					prevPage.cid = this.id;
					
					uni.navigateBack({
					})
					// 跳转空白页防止页面字体放大
					uni.navigateTo({
								url: `/pages/public/Jump`
						})
					
				}
						
				
			},	
			
			// 计算视频播放进度
			 onPlayerTimeupdate (player) {
				 var num1 = player.detail.duration
				 var num2 = player.detail.currentTime
				 var num3 = (num2 / num1) * 100
				 
				 if (num3 > 99){
					 num3 = 100
				 }
				 this.gklog = num3.toFixed(0);
			  },
			 
			
		}
		
		
		
		
		
	}
	
</script>

<style>

</style>
