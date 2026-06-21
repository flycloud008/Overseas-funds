<template>
	<view>
		<view class="indent">
			<view class="indent-a" v-if="order.paid==-1">交易关闭</view>
			<view class="indent-a">{{order.orderTypeViewStr}}</view>
			<view class="u-flex indent-b">
				<view class="indent-c">订单号：</view>
				<view>{{order.id}}</view>
			</view>
			<view class="u-flex indent-b">
				<view class="indent-c">下单时间：</view>
				<view class="indent-c">{{order.createDate}}</view>
			</view>
		</view>
		<view class="send" v-if="order.orderType>=1&&order.paid==1" @click="goLogisticse(order.id)">
			<view class="u-flex">
				<view>
					<u-image src="../../static/che.png" width="40rpx" height="40rpx" />
				</view>
				<view class="send-a" v-if ="order.orderType==1&&order.paid==1">您的订单已派发给{{order.deliveryName}}</view>
				<view class="send-a" v-if ="order.orderType==2&&order.paid==1">您的订单已签收</view>
				<view class="send-a" v-if ="order.orderType==3&&order.paid==1">您的订单已完成</view>
				<view class="send-d">
					<text class="yticon icon-you"></text>
				</view>
			</view>
			<view class="u-flex send-b">
				<view class="send-c">发货时间：{{order.sendOrderDate|formatDate}}</view>
			</view>
		</view>
		<view class="ressee">
			<view class="u-flex">
				<view>
					<u-image src="../../static/diz.png" width="40rpx" height="40rpx" />
				</view>
				<view class="ressee-a">收件人：</view>
				<view class="ressee-b">{{order.trueName}}</view>
				<view class="ressee-b">{{order.userPhone}}</view>
			</view>
			<view class="u-flex ressee-c">{{order.userAddress}}</view>
		</view>
		<view class="ressee u-flex">
			<view>
				<u-image src="../../static/jia.png" width="36rpx" height="36rpx" />
			</view>
			<view class="ressee-a">收货日期不限</view>
		</view>
		<view class="goods-section" v-for="(goodsItem, goodsIndex) in order.orderData" :key="goodsIndex" @click="goShopProduct(goodsItem.pid)">
			<view class="g-item">
				<image :src="vuex_baseImgUrl+goodsItem.image" />
				<view class="right">
					<text class="title">{{goodsItem.name}}</text>
					<view class="spec">{{goodsItem.skuName}}</view>
					<view class="price-box">
						<text class="price">￥{{goodsItem.price}}元</text>
						<text class="number">x {{goodsItem.buyNum}}</text>
					</view>
				</view>
			</view>
		</view>
		<view  class="detail">
			<view class="u-flex u-row-between" v-if="order.refundReason">
				<view  class="detail-a">拒绝退款原因:</view>
				<view  class="detail-b">{{order.refundReason}}</view>
			</view>
			<view class="u-flex u-row-between">
				<view  class="detail-a">商品总价</view>
				<view  class="detail-b">￥{{order.totalPrice}}</view>
			</view>
			<view class="u-flex u-row-between">
				<view  class="detail-a">运费</view>
				<view  class="detail-b">到付</view>
			</view>
			<view class="u-flex u-row-between">
				<view  class="detail-a">优惠金额</view>
				<view class="detail-b">-￥{{order.deductionPrice.toFixed(2)}}</view>
			</view>
			<view class="u-flex u-row-between" >
				<view  class="detail-a"  v-if="order.paid==1">实付款</view>
				<view  class="detail-a"  v-if="order.paid==0">应付金额</view>
				<view class="detail-c">￥{{order.payPrice}}</view>
			</view>
		</view>
		<view class="ressee u-flex" v-if="order.buyType==5">
			<view class="ressee-a">活动抽奖获得</view>
		</view>
		<!-- 底部 -->
		
		<view class="bottomCount u-flex u-row-right">
			<view class="u-flex">
				<view><u-button :custom-style="customStyle" shape="circle" size="mini"  v-if="order.paid==-1" @click="deleteOrder(order)">删除订单</u-button></view>
				<view><u-button :custom-style="customStyle" shape="circle" size="mini" @click="goEvaluate(order.id)" v-if="order.orderType ==2">去评价</u-button></view>
				 
				<view  v-if="(order.orderType ==0||order.orderType ==1)&&order.paid==1">
					<u-button :custom-style="customStyle" shape="circle" size="mini"@click="goLogisticse(order.id)" v-if="order.orderType ==1">查看物流</u-button>
				</view>
				<view  v-if="(order.orderType ==0||order.orderType ==1)&&order.paid==1">
					<u-button :custom-style="customStyle" shape="circle" size="mini"@click="goReceiving(order.id)" v-if="order.orderType ==1">确认收货</u-button>
					</view>
				<view><u-button :custom-style="customStyle" shape="circle" size="mini" v-if="order.paid == 0" @click="cancelOrder(order)">取消订单</u-button></view>
				<view><u-button :custom-style="customStyle" shape="circle" size="mini" v-if="order.paid == 0" @click="goPayment(order)">立即支付</u-button></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				customStyle: {
					'margin-right': '30rpx'
				},
				id:"",
				order:{},
			};
		},
		async onLoad(e){
			this.id = e.id
		},
		
		onShow() {
			this.loadData()
		},
		methods:{
			
			async loadData(){
				let orderDetail = await this.$u.post("/plug_shop/shopuser/orderDetail",{id:this.id});
				this.order = orderDetail.order
				this.order.orderData = JSON.parse(orderDetail.order.orderData);
			},
			//去商品
			goShopProduct(id){
				this.buyType=this.order.buyType;
				if(this.buyType==1){
					//商品购买
					uni.navigateTo({
						url:'/pages/shop/product?id='+id
					})
				}
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
			// //申请退款
			// goRefund(id){
			// 	uni.showModal({
			// 	    content: '确定要申请退款吗',
			// 	    success: async (e)=>{
			// 	    	if(e.confirm){
			// 				let goRefund = await this.$u.post("/plug_shop/shopuser/goRefund",{id:id});
			// 				if(goRefund && goRefund.result == 'true') {
			// 					this.loadData()
			// 				}
			// 	    	}
			// 	    }
			// 	});
			// },
			
			//再次购买
			goAgain(){
				let list = this.order.shopOrderCreateData;
				let checkList = [];
				list.forEach(item=>{
					let checkItem = {};
					checkItem.pid = item.pid;
					checkItem.sku = item.skuName;
					checkItem.buyNum = item.buyNum;
					checkList.push(checkItem);
				})
				if(checkList.length == 0 ){
					uni.showToast({
						title: '订单有误',
						icon: 'none',
					})
					return;
				}
				uni.navigateTo({
								url: `/pages/shop/createOrder?data=${JSON.stringify({
									goodsData: checkList
								})}`
							})

			},
			//查看物流
			goLogisticse(id){
					this.navTo("/pages/shop/logistics",{id:id});
			},
			//确认收货
			goReceiving(id){
				uni.showModal({
				    content: '确定已经收货了吗',
				    success:async (e)=>{
				    	if(e.confirm){
						let goReceiving = await this.$u.post("/plug_shop/shopuser/goReceiving",{id:id});
						if(goReceiving && goReceiving.result == 'true') {
							this.loadData()
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
								uni.navigateBack({
									delta: 1
								});												
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
								this.loadData()
							}
				    	}
				    }
				});
			},
		
		},
		filters: {
			formatDate: function (value) {
				let date = new Date(value);//这个是纳秒的，想要毫秒的可以不用除以1000000
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			  }
			},
	}
</script>

<style lang="scss">
	
	page {
		background: #f1f1f1;
	}

	.indent {
		// height: 200rpx;
		margin-top: 6rpx;
		background-color: #fff;
		padding: 20rpx;

		&-a {
			font-size: 32rpx;
			color: #ff0000;
			margin-bottom: 15rpx;
		}

		&-b {
			color: #838383;
			margin-bottom: 8rpx;
		}

		&-c {
			margin-right: 10rpx;
		}
	}

	.send {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx;

		&-a {
			font-size: 30rpx;
			font-weight: 700;
			margin-left: 20rpx;
		}

		&-b {
			margin-top: 10rpx;
		}

		&-c {
			margin: 0 15rpx 0 60rpx;
		}

		&-d {
			margin-left: 240rpx;
		}
	}

	.ressee {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx;

		&-a {
			font-size: 30rpx;
			font-weight: 700;
			margin-left: 20rpx;
			margin-right: 15rpx;
		}

		&-b {
			font-size: 30rpx;
			font-weight: 700;
			margin-right: 10rpx;
		}

		&-c {
			font-size: 30rpx;
			font-weight: 700;
			margin-left: 60rpx;
			margin-top: 10rpx;
		}
	}

	.goods-section {
		margin-top: 20rpx;
		background: #fff;
		padding: 5rpx 0;


		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				padding-left: 24rpx;
			}

			.title {
				font-size: 30upx;
			}

			.spec {
				margin-top: 10rpx;
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				padding-top: 10upx;

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}
		}
	}
	.detail {
		// height: 200rpx;
		margin-top: 6rpx;
		background-color: #fff;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		&-a{
			color: #838383;
			margin-bottom: 8rpx;
		}
		&-b{
			font-weight: 700;
		}
		&-c{
			color: #ff0000;
			font-size: 36rpx;
			font-weight: 700;
		}
	}
	.bottomCount{
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 20rpx;
		box-shadow: 0px -3px 6px rgba(200, 197, 197, 0.4);
	}
</style>
