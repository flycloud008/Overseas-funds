<template>
	<view class="container">
		<view class="flex-fill overflow-hidden">
			<view class="content" v-if="!pageData.data.length">
				<u-empty text="暂无数据" mode="list"></u-empty>
			</view>
			<scroll-view class="content" scroll-y v-else>
				<list-cell v-for="(item, index) in pageData.data" :key="index">
					<view class="score">
						<view class="left">
							<view class="title mb-8">{{ item.changeType}}</view>
							<view class="mb-8" v-if=" item.remarks">{{ item.remarks }}</view>
							<view>{{ item.createDate }}</view>
						</view>
						<view class="right" :style="item.changeMoney>=0?'color:green':'color:red'">{{ item.changeMoney }}</view>
					</view>
				</list-cell>
			</scroll-view>
			
			<!-- 加载更多提示 -->
			<uni-load-more :status="pageData.loadType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			listCell,
			uniLoadMore	
		},
		data() {
			return {
				title:'',
				moneyType : [],
				money : 0,
				changeType : [],
				pageData:{
					pageNo: 1,
					pageSize: 20,
					loadType: "more" ,
					data: [],
				},
			};
		},
		onReady(){
			uni.setNavigationBarTitle({
				title:this.title+"记录"
			})	
		},
		onLoad(option) {
			this.title = option.title;
			this.changeType = option.changeType;
			this.moneyType = option.moneyType;
		
			this.load();
			
		},
		methods: {
			async load(){
				let userinfo = await this.$u.post("/login/getLoginUserinfo");
				this.vuex_updateUser(userinfo);	
				
				this.loadPage("/work_ddl/user/getUserAccountChange",{moneyType:this.moneyType,changeType:this.changeType});
				
			},
			onReachBottom(){
				this.loadPage("/work_ddl/user/getUserAccountChange",{moneyType:this.moneyType,changeType:this.changeType});
			},
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
				}
			}
			
			.right {
				font-size: $font-size-lg;
				color: $color-primary;
				margin-right: 20rpx;
			}
		}
	}
</style>
