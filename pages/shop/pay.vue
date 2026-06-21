<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price" v-if="SW5">{{payMoney}}</text>
			<text class="price" v-if="SW4">{{payMoney - userinfo}}</text>
			<text class="m-price" v-if="SW4">¥{{payMoney}}</text>
		</view>
		
		<view class="pay-type-list">
			<!-- changePayType(1) -->
			<view class="type-item b-b" @click="flags5 == true ?changePayType(4):changePayType(1),p2()" v-if="iswx==1" >
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#50d0af" :checked=' flags5 == true ? payType==4 : payType ==1'/>  
				</label>
			</view>
			<view class="type-item b-b" @click="flags5 == true ?changePayType(5):changePayType(2),p2()" v-if="isali==1">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#50d0af" :checked='checkAli()' />
				</label>
			</view>
			
			<view class="type-item" v-if="flags3">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">消费金不足
					</text>
					<text>可用消费金:&nbsp;¥{{vuex_userInfo.member.balance}}
					</text>
				</view>
				<label class="radio">
					<u-switch active-color="#50d0af" style="font-size:45rpx;" size="45rpx"></u-switch>
				</label>
			</view>
			
			
			<view class="type-item" @click="changePayType(3)" >
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">消费金支付</text>
					<text>可用消费金:&nbsp;¥{{vuex_userInfo.member.balance}}
					 </text>
				</view>
				<label class="radio">
					<u-switch v-model="sw2" @change="changePayType(3)" active-color="#50d0af" style="font-size:45rpx;" size="45rpx"></u-switch>
				</label>
			</view>
			
			
		<!-- 	<view class="type-item"  v-if="flags1">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">消费金不足</text>
					<text>可用消费金:&nbsp;¥{{vuex_userInfo.member.balance}}
					<text>点我组合支付</text>
					</text>
				</view>
				<label class="radio">
					<u-switch v-model="sw"  active-color="#50d0af" style="font-size:45rpx;" size="45rpx"></u-switch>
				</label>
			</view> -->
			
		</view>
		
		<text class="mix-btn" @click="confirm">确认支付</text>
		<u-modal v-model="showBackModal" content="您的订单未支付成功,是否要取消订单?" :show-title="false" :show-cancel-button="true" :mask-close-able="true" @confirm="closeProduct()" @cancel="cancelProduct()"></u-modal>
	</view>
</template>

<script>
	//
	import{
		mapState,
		mapMutations
	}from 'vuex';
	//
	var _seif;
	export default {
		data() {
			return {
				payType: 3,
				orderInfo: {},
				orderId : 0,
				payMoney : 0,
				interval:null,
				showBackModal: false,
				isali: 1,
				iswx: 1,
				userinfo:{},
				WeiPay:null,
				flags1:false,
				flags2:false,
				flags3:false,
				flags5:false,
				sw:false,
				sw2:true,
				sw3:false,
				SW4:false,
				SW5:true,
			};
		},
		watch:{
			sw(val){
				if(val == true){
					this.flags5 = true;
					this.payType = 4;
				}
				if(val == false){
					this.flags5 = false;
					this.payType = 1;
				}
				
				if(val == true && (this.payType == 4 || this.payType ==5)){
					this.SW4 = true;
					this.SW5 = false;
				}
				if(val == false && (this.payType == 1 || this.payType ==2)){
					this.SW4 = false;
					this.SW5 = true;
				}
			},
			sw2(val){
				if(val == true){
					this.sw3 = true;
				}
				if(val == false){
					this.sw3 = false;
				}
			},
			
		},
		
		computed: {
			...mapState(['vuex_userInfo'])
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {  
				return false;  
			}  
			//取消订单
			this.showBackModal = true;
			return true;  
		},
		async onLoad(options) {
			console.log(JSON.stringify(options))
			this.orderId = options.oid;
			this.payMoney = options.payMoney;
			
			let userinfo = await this.$u.post("/login/getLoginUserinfo");
			this.vuex_updateUser(userinfo);
			let type = await this.$u.post("/plug_shop/shopuser/getPayType");
			this.isali = type.ali
			this.iswx = type.wx
			// 将{{vuex_userInfo.member.balance}} => userinfo
			this.userinfo =  this.$store.state.vuex_userInfo.member.balance;
			
			this.WeiPay = this.payMoney - this.userinfo;
			
			//组合支付
			if(this.userinfo < this.payMoney && this.userinfo >0){
				this.flags1 = true;
			}
			//消费金支付
			if(this.userinfo >= this.payMoney){
				this.flags2 = true;
			}
			//消费金不足
			if(this.userinfo == 0){
				this.flags3 = true; 
			}
			
		},
		
		methods: {
			p1:function(){
			  let up =  this.$data.userinfo;  
			  let sp = this.$data.payMoney;   
			  let isMoney = up < sp;      
			  this.t = isMoney;
			},
			p2:function(){
				if(this.sw2 == true){
					this.sw2 = false;
				}
			},
			
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			
			checkAli(){ 
				uni.showToast({
				    title: '支付宝暂不可用,等待支付宝审核通过',
					icon:'none',
				    duration: 1000
				});
			    return 	this.flags5 == true ? this.payType==5 : this.payType ==2;
				
			},
			
			//确认支付
			confirm: async function() {
				if(this.sw == true && (this.payType == 1 || this.payType == 2)){
					uni.showToast({
					    title: '请选择支付方式',
						icon:'none',
					    duration: 1000
					});
					return ;
				}
				
				let result = await this.$u.post("/plug_shop/shopuser/payProduct",{oid:this.orderId, payType:this.payType});
				if(this.payType == 3){
					if(!result){
						return ;
					}
					if(this.payType == 3){
						uni.showLoading({
							title: '订单支付中'
						});
					}	
					 this.interval = setInterval(() => {
						this.checkPayState();
					}, 1000);
				}else if(this.payType == 2){
					if(this.isali==0){
						this.$api.msg('商家未开通支付宝支付');
						return ;
					}
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: result.data, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
					   success: (res) => {
							this.interval = setInterval(() => {
								this.checkPayState();
								}, 1000);
							},
							fail: function (err) {
							console.log('fail:' + JSON.stringify(err));
							uni.showToast({
								title:'用户取消支付',
								icon:'none',
								duration:1000,
							})
						}
					});
				}else if(this.payType == 1){
					if(this.isali==0){
						this.$api.msg('商家未开通微信支付');
						return ;
					}
					let wx =  JSON.parse(result.data)
					uni.requestPayment({
					    "provider": "wxpay", 
					    "orderInfo": 
						{
					        "appid": wx.appId,  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
					        "partnerid": wx.partnerid,      // 微信支付商户号
					        "prepayid": wx.prepayid, // 统一下单订单号 
					        "package": wx.package,        // 固定值
					        "noncestr": wx.noncestr, // 随机字符串
					        "timestamp": wx.timeStamp,        // 时间戳（单位：秒）
					        "sign": wx.sign // 签名，这里用的 MD5 签名
					    },
					   success: (res) => {
							this.interval = setInterval(() => {
								this.checkPayState();
								}, 1000);
							},
					    fail(e) {
							console.log('fail:' + JSON.stringify(e));
						}
					})
				}
				else if(this.payType == 4){
					if(this.iswx ==0){
						this.$api.msg('商家未开通微信支付');
						return ;
					}
					let wx = JSON.parse(result.data)
					uni.requestPayment({
						"provider": "wxpay",
						"orderInfo": 
						{
						    "appid": wx.appId,  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
						    "partnerid": wx.partnerid,      // 微信支付商户号
						    "prepayid": wx.prepayid, // 统一下单订单号 
						    "package": wx.package,        // 固定值
						    "noncestr": wx.noncestr, // 随机字符串
						    "timestamp": wx.timeStamp,        // 时间戳（单位：秒）
						    "sign": wx.sign // 签名，这里用的 MD5 签名
						},
						success: (res) => {
								this.interval = setInterval(() => {
									this.checkPayState();
								}, 1000);
							},
						 fail(e) {
								console.log('fail:' + JSON.stringify(e));
								uni.showToast({
									title:'用户取消支付',
									icon:'none',
									duration:1000,
								})
								
						}
					})
				}
				else if (this.payType == 5){
					if(this.isali==0){
						this.$api.msg('商家未开通支付宝支付');
						return ;
					}
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: result.data, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
					   success: (res) => {
							this.interval = setInterval(() => {
								this.checkPayState();
								}, 1000);
							},
						fail: function (err) {
							console.log('fail:' + JSON.stringify(err));
							let errmsg = JSON.stringify(err);
							console.log(errmsg);
							uni.showToast({
								title:'用户取消支付',
								icon:'none',
								duration:1000,
							});
						},
							
					});
				}
			},
			async checkPayState(){
				// uni.showLoading({
				// 	title: '订单支付中'
				// });
				//检测支付状态
				let result = await this.$u.post("/plug_shop/shopuser/getProductPayState",{oid:this.orderId});
				console.log(result)
				if(result.result == "true"){
					if(result.shopOrder.paid == "0" && result.shopOrder.payfaildMsg && result.shopOrder.payfaildMsg != ''){
						clearInterval(this.interval);
						this.$u.route({
									url: '/pages/shop/paySuccess',
									type : 'redirect',
									params: {type:0,msg:result.shopOrder.payfaildMsg}
								})
						// this.$u.route('/pages/money/paySuccess',{type:0,msg:result.shopOrder.payfaildMsg});
					}
					else if(result.shopOrder.paid == "1"){
						clearInterval(this.interval);
						this.$u.route({
									url: '/pages/shop/paySuccess',
									type : 'redirect',
									params: {type:1,msg:"订单支付成功"}
								})
						// this.$u.route('/pages/money/paySuccess',{type:1,msg:"订单支付成功"});
						return ;
					}
				}
				else{
					uni.hideLoading();
					clearInterval(this.interval);
				}
			},
			async closeProduct(){
				await this.$u.post("/plug_shop/shopuser/closeProduct",{oid:this.orderId});
				uni.navigateBack({
					delta:1
				})
			},
			cancelProduct(){
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style lang='scss'>
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}
	.m-price{
		margin:0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
		margin-left: 30rpx;
		margin-top: 5rpx;
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
	
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: #50d0af;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px #50d0af;
	}

</style>
