<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
				
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.createDate}}</text>
							<text v-if="item.paid!=-1"  class="state" :style="{color: item.stateTipColor}">{{item.orderTypeViewStr}}</text>
							<text 
								v-if="item.paid===-1" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(item)"
							></text>
						</view>
						<view @click="goOrderDetail(item)">
						<scroll-view v-if="item.orderData.length > 1" class="goods-box" scroll-x>
							<view
								v-for="(goodsItem, goodsIndex) in item.orderData" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="vuex_baseImgUrl+goodsItem.image" mode="aspectFill"></image>
							</view>
							
						</scroll-view>
						<view 
							v-if="item.orderData.length === 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.orderData" :key="goodsIndex"
						>
							<image class="goods-img" :src="vuex_baseImgUrl+goodsItem.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.name}}</text>
								<text class="attr-box">{{goodsItem.skuName}}  x {{goodsItem.buyNum}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>
						
						<view class="price-box" v-if="item.refundReason">拒绝退款原因：{{item.refundReason}}</view>
						<view class="price-box" v-if="item.paid==1">
							共
							<text class="num">{{item.orderData.length}}</text>
							件商品
							<text class="num">{{item.payTypeViewStr}}</text>
							实付款
							<text class="price">{{item.payPrice}}</text>
						</view>
						<view class="price-box" v-if="item.buyType==5">
							活动抽奖获得
						</view>
						</view>
						<view class="price-box" v-if="item.paid==-1">交易关闭</view>
						<view class="action-box b-t" v-if="item.orderType ==2">
							<button @click="goEvaluate(item.id)" class="action-btn recom">去评价</button>
						</view>
						<view class="action-box b-t" v-if="(item.orderType ==0||item.orderType ==1)&&item.paid==1">
							<!-- <button @click="goRefund(item.id)" v-if="item.iscanRefund==1" class="action-btn recom">申请退款</button> -->
							<button @click="goLogisticse(item.id)" v-if="item.orderType ==1" class="action-btn recom">查看物流</button>
							<button @click="goReceiving(item.id)" v-if="item.orderType ==1" class="action-btn recom">确认收货</button>
						</view>
						<view class="action-box b-t" v-if="item.paid == 0">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom" @click="goPayment(item)">立即支付</button>
						</view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty,
			
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: [],
						pageSize : 5,
						pageNo : 1,
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: [],
						pageSize : 5,
						pageNo : 1,
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: [],
						pageSize : 5,
						pageNo : 1,
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: [],
						pageSize : 5,
						pageNo : 1,
					},
					{
						state: 4,
						text: '售后',
						loadingType: 'more',
						orderList: [],
						pageSize : 5,
						pageNo : 1,
					}
				],
				
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			// this.loadData()
			// #endif
			// #ifdef MP
			// if(options.state == 0){
			// 	this.loadData()
			// }
			// #endif
			
		},
		onShow() {
			this.loadData('operation')
			// this.navList[this.tabCurrentIndex].pageNo=1
		},
		methods: {
			
			//获取订单列表
			async loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if(source!=='operation'){
					if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
					}
					if(navItem.loadingType === 'loading'){
						//防止重复加载
						return;
					}
					if(navItem.loadingType === 'nomore'){
						return;
					}
				}else{
					navItem.pageNo=1
				}
				
				
				navItem.loadingType = 'loading';
				
				let resultList = await this.$u.post("/plug_shop/shopuser/getUserPorductList",{orderType:state,pageNo:navItem.pageNo , pageSize:navItem.pageSize});
				
				if(resultList.orderList && resultList.orderList.pageNo){
					let pageNo = resultList.orderList.pageNo;
					let pageSize = resultList.orderList.pageSize;
					let pageCount = resultList.orderList.count;
					
					if(pageNo * pageSize >pageCount){
						navItem.loadingType = 'nomore';
					}else{
						navItem.pageNo += 1;
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = 'more';
					}
				}
				if(resultList.orderList.count==0|| source=='operation'){
					console.log(navItem.orderList)
					navItem.orderList=[]
				}
				resultList.orderList.list.forEach(item=>{
					item = Object.assign(item, this.orderStateExp(item));
					item.orderData = JSON.parse(item.orderData);
					navItem.orderList.push(item);
				})
				// navItem.orderList = navItem.orderList.concat(resultList.orderList.list);
				
				
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				
				
				
				// setTimeout(()=>{
				// 	let orderList = Json.orderList.filter(item=>{
				// 		//添加不同状态下订单的表现形式
				// 		item = Object.assign(item, this.orderStateExp(item.state));
				// 		//演示数据所以自己进行状态筛选
				// 		if(state === 0){
				// 			//0为全部订单
				// 			return item;
				// 		}
				// 		return item.state === state
				// 	});
				// 	orderList.forEach(item=>{
				// 		navItem.orderList.push(item);
				// 	})
				// 	//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				// 	this.$set(navItem, 'loaded', true);
					
				// 	//判断是否还有数据， 有改为 more， 没有改为noMore 
				// 	navItem.loadingType = 'more';
				// }, 600);	
			}, 
			 goOrderDetail(item){
				 this.navTo("/pages/order/goods",{id:item.id})
			 },
			//swiper 切换
			changeTab(e){
				this.loadData("operation");
				this.tabCurrentIndex = e.target.current;
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			
			
			//去评价
			goEvaluate(id){
					uni.navigateTo({
					url: "/pages/shop/Toevaluate?oid="+id
					})
			},
			//去支付
			goPayment(item){
				// for(let i=0;i<this.navList.length;)
				this.navTo("/pages/shop/pay",{oid:item.id,payMoney:item.payPrice,isJinDou:item.isJinDou})
			},
			
			//查看物流
			goLogisticse(id){
					this.navTo("/pages/shop/logistics",{id:id});
			},
			goOrderDetail(item){
										 this.navTo("/pages/shop/goods",{id:item.id})
									 },
			//确认收货
			goReceiving(id){
				uni.showModal({
				    content: '确定已经收货了吗',
				    success:async (e)=>{
				    	if(e.confirm){
						let goReceiving = await this.$u.post("/plug_shop/shopuser/goReceiving",{id:id});
						if(goReceiving && goReceiving.result == 'true') {
							console.log(1)
							let index = this.tabCurrentIndex;
							this.navList[index].orderList.forEach(item=>{
								if(goReceiving.data.id == item.id){
									item.orderType = goReceiving.data.orderType;
									item.orderTypeViewStr = goReceiving.data.orderTypeViewStr;
								}
							})
							// this.loadData('operation')
						}
				    	}
				    }
				});
			},
			
			//删除订单
			deleteOrder(item){
				uni.showModal({
				    content: '确定要删除该订单吗',
				    success:async (e) =>{
				    	if(e.confirm){
							let deleteOrder = await this.$u.post("/plug_shop/shopuser/deleteOrder",{oid:item.id});
							if(deleteOrder && deleteOrder.result == 'true') {
								uni.showLoading({
									title: '请稍后'
								})
								setTimeout(()=>{
									let a = this.tabCurrentIndex;
									let list = this.navList[a].orderList;
									let index = list.findIndex(val=>val.id === item.id);
									list.splice(index, 1);
									uni.hideLoading();
								}, 600)
							}
						}
				    }
				});
			},
			//取消订单
			cancelOrder(item){
				uni.showModal({
				    content: '确定要取消订单吗',
				    success: async(e)=>{
				    	if(e.confirm){
							let cancelOrder = await this.$u.post("/plug_shop/shopuser/closeProduct",{oid:item.id});
							if(cancelOrder && cancelOrder.result == 'true') {
								let index = this.tabCurrentIndex;
								this.navList[index].orderList.forEach(item=>{
									if(cancelOrder.data.id == item.id){
										item.paid = cancelOrder.data.paid;
										item.orderTypeViewStr = goRefund.data.orderTypeViewStr;
									}
								})
							}
							// this.loadData('operation')
				    	}
				    }
				});
			},



			//订单状态文字和颜色
			orderStateExp(item){
				let  stateTipColor = 'red';
					
				if(item.paid == -1){
					stateTipColor = '#909399';
				}
				return {stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}
	
	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
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
		/* 骨架屏替代方案 */
		.Skeleton {
			background: #f3f3f3;
			padding: 20upx 0;
			border-radius: 8upx;
		}
	
	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;
	
		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;
	
			&.loaded {
				opacity: 1;
			}
		}
	}
	
	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}
	
	.common-hover {
		background: #f5f5f5;
	}
	
	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}
	
	.b-b:after {
		bottom: 0;
	}
	
	.b-t:after {
		top: 0;
	}
	
	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;
	
		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}
	
	uni-button[type=default],
	button[type=default] {
		color: $font-color-dark;
	}
	
	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}
	
	.placeholder {
		color: #999999;
	}
	
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: #50d0af;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #50d0af;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #2ccda9;
				color: #fff;
				&:after{
					border-color: #2ccda9;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
