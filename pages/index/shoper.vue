<template>
	<view class="container">
		<view class="flex-fill overflow-hidden">
			<view class="content" v-if="dataList.length==0">
				<u-empty text="暂无数据" mode="list"></u-empty>
			</view>
			<scroll-view class="content" scroll-y v-else>
				<view class="guess-section" style="padding-top: 20px;">
						<view 
							v-for="(item, index) in dataList" :key="index"
							class="guess-item"
							@click="navToDetailPage(item)"
						>
							<view class="image-wrapper">
								<image :src="item.cardimg1" mode="aspectFit"></image>
							</view>
							<text class="title clamp">{{item.name}}123123123123123123123123123123</text>
							<text class="price">地址:{{item.address}}</text>
						
						</view>
						
				</view>
			</scroll-view>
			
			<!-- 加载更多提示 -->
			<!-- <uni-load-more :status="pageData.loadType"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				dataList:[],
				pageData:{
					pageNo: 1,
					pageSize: 20,
					loadType: "more" ,
					data: [],
				},
			};
		},
		onReady(){
			
		},
		onLoad(option) {
	
		
			this.load();
			
		},
		methods: {
			async load(){
				
					var res =  await this.$u.post("/html/work_ddl/index/getDDLShoperList",{});
					this.dataList = res.data
				
			},
			onReachBottom(){
				//this.loadPage("/work_ddl/user/getUserAccountChange",{moneyType:this.moneyType,changeType:this.changeType});
			},
			navToDetailPage(item){
				let id = item.id;
				uni.navigateTo({
					url: `/pages/index/shoperDetail?id=${id}`
				})
			}
			
		}
		
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}
	
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.header {
		margin-bottom: 20rpx;
		background-color: $bg-color-white;
		width: 100%;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: $font-size-medium;
		color: $text-color-base;
		
		.value {
			font-size: 64rpx;
			color: $color-primary;
			font-weight: 500;
		}
		
		.rules {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			
			.rules-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
	}
	
	.content {
		width: 100%;
		height: 100%;
		background-color: $bg-color-white;
		display: flex;
		flex-direction: column;
		
		.top {
			padding: 20rpx 30rpx;
			font-size: $font-size-lg;
			font-weight: 500;
		}
		
		.score {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.left {
				display: flex;
				flex-direction: column;
				font-size: $font-size-sm;
				color: $text-color-assist;
				width: 85%;
				word-wrap:break-word;
				
				.title {
					font-size: $font-size-lg;
					color: $text-color-base;
					margin-bottom: 10rpx;
					overflow:hidden; /*内容会被修剪，并且其余内容是不可见的。*/
					text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本*/
					white-space: nowrap; 
				}
			}
			
			.right {
				font-size: $font-size-lg;
				color: $color-primary;
				margin-right: 20rpx;
			}
		}
	}
	
	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
	
		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
	
			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}
	
		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
	
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
	
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
			overflow:hidden; /*内容会被修剪，并且其余内容是不可见的。*/
			text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本*/
			white-space: nowrap; 
		}
	
		.price {
			font-size: 12px;
			line-height: 1;
			overflow:hidden; /*内容会被修剪，并且其余内容是不可见的。*/
			text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本*/
			white-space: nowrap; 
		}
	
	}
</style>
