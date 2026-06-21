<template>
	<view>
		 <view  class="u-text-left u-margin-30 ">
			 <text class="u-font-xl">{{article.title}}</text>
			 <view class="u-margin-top-10 titleDetail" >
				 <text class="u-margin-right-20">详情</text>
				 <text>{{article.createDate}}</text>
			 </view>
		
		</view>
		
		<u-line class="u-text-center" />
			
		<view class="u-content">
			<u-parse   :html="articleContent" :autoscroll="true" :tag-style="tagStyle"  ></u-parse>
		</view>
		
	</view>
</template>

<script>
	export default{
		data() {
			return {
				articleId: '',
				tagStyle: {
					img: 'float:left;width:100%',
				} ,
				article : {},
				articleContent : '',
			
			};
		},
		onLoad(options){
			this.articleId = options.id
			this.load();
		},
		computed:{
			
		},
		methods:{
			async load(){
				let result = await this.$u.post("/html/base_core/index/getNewsDetail",{id:this.articleId});	
				if(!result){return ;}
				this.article = result.article;
				if(this.article.articleData){
					this.articleContent  = this.article.articleData.content;
				}
			
				
			},
		}
	}
</script>

<style  lang='scss' >
	.titleDetail{
		color: $u-type-info
	}
	.u-content {
			width: 100%;
			padding: 15rpx;
			white-space:pre-wrap;
			word-wrap:break-word;
	}
	view,
		scroll-view,
		swiper,
		swiper-item,
		cover-view,
		cover-image,
		icon,
		text,
		rich-text,
		progress,
		button,
		checkbox,
		form,
		input,
		label,
		radio,
		slider,
		switch,
		textarea,
		navigator,
		audio,
		camera,
		image,
		video {
			box-sizing: border-box;
		}
</style>
