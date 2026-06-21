<template>
	<view>
	
	<view class="particulars2 u-flex-col"  v-for="(item, index) in datainfo" :key="index">
		<view class="name u-flex">
			<view class="pic"><image :src="item.avatar"></image></view>
			<view class="names">{{item.userName}}</view>
			<view class="time">{{item.createDate}}</view>
		</view>
		
		<view class="content">{{item.comment}}</view>
		<view class="commodity u-flex u-flex-wrap u-row-left">
			<view v-for="(item2, index) in item.image" :key="index" class="u-flex u-flex-wrap">
				<image :src="item2"></image>
			</view>		
		</view>
		<view class="score1 u-flex"><view class="word">商品评分:</view><u-rate :current="item.productScore" :disabled="true"></u-rate></view>
		<view class="score u-flex"><view class="word">服务评分:</view><u-rate :current="item.serviceScore" :disabled="true"></u-rate></view>
		<view class="reply u-flex-col" v-if="item.replyContent">
		
			<view class="boss"><u-icon name="kefu-ermai"></u-icon>掌柜回复</view>
			<view>{{item.replyContent}}</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pid:'',
				datainfo:[]
				
			};
		},
		
		created() {
			const info = uni.getSystemInfoSync(); 
			this.statusBarHeight = info.statusBarHeight;			
			//#ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); 
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight);	
			//#endif
		},
		async onLoad(options){
			console.log(options.pid)
					this.pid = options.pid
				// 评价
				let replyList = await this.$u.post("/html/plug_shop/shopindex/getShopProductReplyList",{pid:this.pid});
				console.log(replyList.data) 
				replyList.data.map(item => {
					if(item.image) {
						item.image = item.image.split('|')
					}
				})
				this.datainfo=replyList.data;
		},	
	}
	
	
	
</script>

<style lang="scss">
page{
		background-color: #f5f5f5;
	}
	.particulars{
		width: 100%;
		background-color: #FFFFFF;
	}
    .name{
		image{
			width: 50rpx;
			height: 50rpx;
			margin-left: 20rpx;
		}
	}
	.names{
		font-size: 12rpx;
		margin-left: 10rpx;
	}
	.describe{
		font-size: 10px;
		color: #999999;
		margin-left: 20rpx;
	}
	.content{
		margin-left: 20rpx;
		margin-top: 10rpx;
		margin-right: 10rpx;
	}
	.commodity{
		width: 100%;
	}
	.commodity{
		image{
			width: 220rpx;
			height: 220rpx;
			margin-left: 20rpx;
			margin-top: 10rpx;

		}
	}
	.reply{
		width: 700rpx;
		height: 100rpx;
		background-color: #f8f8f8;
		margin-left: 20rpx;
		margin-top: 10rpx;
		font-size: 10px;
		border-radius: 10rpx;
		color: #666666;
		margin-bottom: 20rpx;
	}
   .particulars2{
   	width: 100%;
   	background-color: #FFFFFF;
	margin-top: 20rpx;
   }
   .time{
	   margin-left: 350rpx;
	   font-size: 10px;
	   color: #666666;
   }
   .score1{
	   margin-left: 20rpx;
	   margin-top: 10rpx;
   }
   .score{
   	   margin-left: 20rpx;
   }
</style>
