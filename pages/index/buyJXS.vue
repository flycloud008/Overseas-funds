 <template>
 	<view>


 		<view class="goods-section">
 			<view class="g-header b-b">
 				<image class="logo" :src="item.image"></image>
 				<text class="name">{{item.name}}资格兑换</text>
 			</view>
 			<!-- 商品列表 -->
 			<view class="g-item">
 				<image  :src="item.image"></image>
 				<view class="right ">
 					<text class="title clamp">{{item.name}}</text>
 					<text class="spec">
 						欢迎您兑换{{item.name}}资格
 					</text>
 					<view class="price-box">
 						<text class="price">消费金:{{item.moneyLvs}}</text>
 					</view>
 				</view>
 			</view>
 		</view>


 		<!-- 金额明细 -->
 		<view class="goods-section">
 			<view class="g-header b-b">
 				<text class="name" style="font-size: 20px;">权益说明:</text>
 			</view>
			
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;" >
				<view class="spec"> - 99年细胞存储服务</view>
			</view>

 			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;" >
 				<view class="spec"> - 成为健康大使</view>
 			</view>
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;"  >
				<view class="spec"> - 99年细胞存储健康大使证书</view>
			</view>
			
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;"  >
				<view class="spec"> - ?钱细胞健康检测服务</view>
			</view>
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;"  >
				<view class="spec"> - ?次扩增服务</view>
			</view>
			
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;"  >
				<view class="spec"> - 所有服务会员价</view>
			</view>
			
			<view class="yt-list-cell desc-cell " style="padding: 0px 0px 0px 40px;"  >
				<view class="spec"> - ?额外保障</view>
			</view>
			
	
 		</view>

 	
 		<!-- 金额明细 -->
 		<view class="yt-list">

 			<view class="yt-list-cell b-b u-flex u-row-between">
 				<text class="cell-tit clamp">消费金</text>
 				<view class="word u-flex">
 					<text class="cell-tip">当前可使用 {{member.balance}}</text>
 				</view>
 			</view>
 		</view>


 		<!-- 底部 -->
 		<view class="footer">
 			<view class="price-content">
 				<text>实付: </text>
 				<text class="price-tip"></text>
 				<text class="price">消费金:{{item.moneyLvs}}</text>
 			</view>
 			<text class="submit" @click="submit">提交订单</text>
 		</view>

	<u-modal v-model="show" :content="content"  @confirm="confirm" :show-cancel-button="true"></u-modal>
 	</view>
 </template>

 <script>
 	export default {
 		data() {
 			return {
 				id: '',
 				item: {},
 				price: 0,
				member:{},
				show:false,
				content:'是否确认兑换该存储资格?',
				userCardFlag: '',
 			}
 		},
 		onShow() {

 		},
 		onLoad(option) {

 			//商品数据
			this.id = option.id
 			this.loadData();
 		},
 		methods: {

 			async loadData() {
 				//加载经销商产品
 				let ddlShop = await this.$u.post('/work_ddl/user/getDDLShoplevelById', {
 					id: this.id
 				});
 				this.item = ddlShop.data
				
				var user = await this.$u.post("/login/getLoginUserinfo");
				if(user.userinfo){
					this.member = user.userinfo.member;
				}
				
				this.userCardFlag=this.member.userCardFlag;
 			},
			
			async confirm() {
				var res = await this.$u.post('/work_ddl/user/buyDDLShoplevel',{id:this.id});
				
				if( res.result =='true'){
					uni.$u.toast('兑换资格成功');
					setTimeout(function(){
						uni.navigateBack();
					},1000)
				}
				
			},
			
			async submit(){
				var that =this;
				if(this.userCardFlag == '0'){
					uni.$u.toast('清先进行实名认证');
					setTimeout(function(){
						that.navTo('/pages/user/authentication');
					},1500);
					
					return ;
				}
				
				this.show =  true;
			
			}
 		}
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

 	page {
 		background: $page-color-base;
 		padding-bottom: 100upx;
 	}

 	.address-section {
 		padding: 30upx 0;
 		background: #fff;
 		position: relative;

 		.order-content {
 			display: flex;
 			align-items: center;
 		}

 		.icon-shouhuodizhi {
 			flex-shrink: 0;
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 90upx;
 			color: #888;
 			font-size: 44upx;
 		}

 		.cen {
 			display: flex;
 			flex-direction: column;
 			flex: 1;
 			font-size: 28upx;
 			color: $font-color-dark;
 		}

 		.name {
 			font-size: 34upx;
 			margin-right: 24upx;
 		}

 		.address {
 			margin-top: 16upx;
 			margin-right: 20upx;
 			color: $font-color-light;
 		}

 		.icon-you {
 			font-size: 32upx;
 			color: $font-color-light;
 			margin-right: 30upx;
 		}

 		.a-bg {
 			position: absolute;
 			left: 0;
 			bottom: 0;
 			display: block;
 			width: 100%;
 			height: 5upx;
 		}
 	}

 	.goods-section {
 		margin-top: 16upx;
 		background: #fff;
 		padding-bottom: 1px;

 		.g-header {
 			display: flex;
 			align-items: center;
 			height: 84upx;
 			padding: 0 30upx;
 			position: relative;
 		}

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

 		.spec {
 			font-size: 26upx;
 			color: $font-color-light;
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
 				flex: 1;
 				padding-left: 24upx;
 				overflow: hidden;
 			}

 			.title {
 				font-size: 30upx;
 				color: $font-color-dark;
 			}

 			.spec {
 				font-size: 26upx;
 				color: $font-color-light;
 			}

 			.price-box {
 				display: flex;
 				align-items: center;
 				font-size: 32upx;
 				color: $font-color-dark;
 				padding-top: 10upx;

 				.price {
 					margin-bottom: 4upx;

 				}

 				.number {
 					font-size: 26upx;
 					color: $font-color-base;
 					margin-left: 20upx;
 				}
 			}

 			.step-box {
 				position: relative;
 			}
 		}
 	}

 	.yt-list {
 		margin-top: 16upx;
 		background: #fff;
 	}

 	.yt-list-cell {
 		display: flex;
 		align-items: center;
 		padding: 10upx 30upx 10upx 40upx;
 		line-height: 70upx;
 		position: relative;

 		&.cell-hover {
 			background: #fafafa;
 		}

 		&.b-b:after {
 			left: 30upx;
 		}

 		.cell-icon {
 			height: 32upx;
 			width: 32upx;
 			font-size: 22upx;
 			color: #fff;
 			text-align: center;
 			line-height: 32upx;
 			background: #f85e52;
 			border-radius: 4upx;
 			margin-right: 12upx;

 			&.hb {
 				background: #ffaa0e;
 			}

 			&.lpk {
 				background: #3ab54a;
 			}

 		}

 		.cell-more {
 			align-self: center;
 			font-size: 24upx;
 			color: $font-color-light;
 			margin-left: 8upx;
 			margin-right: -10upx;
 		}

 		.cell-tit {
 			flex: 1;
 			font-size: 26upx;
 			color: $font-color-light;
 			margin-right: 10upx;
 		}

 		.cell-tip {
 			font-size: 26upx;
 			color: $font-color-dark;

 			&.disabled {
 				color: $font-color-light;
 			}

 			&.active {
 				color: $base-color;
 			}

 			&.red {
 				color: red;
 			}
 		}

 		&.desc-cell {
 			.cell-tit {
 				max-width: 90upx;
 			}
 		}

 		.desc {
 			flex: 1;
 			font-size: $font-base;
 			color: $font-color-dark;
 		}
 	}

 	/* 支付列表 */
 	.pay-list {
 		padding-left: 40upx;
 		margin-top: 16upx;
 		background: #fff;

 		.pay-item {
 			display: flex;
 			align-items: center;
 			padding-right: 20upx;
 			line-height: 1;
 			height: 110upx;
 			position: relative;
 		}

 		.icon-weixinzhifu {
 			width: 80upx;
 			font-size: 40upx;
 			color: #6BCC03;
 		}

 		.icon-alipay {
 			width: 80upx;
 			font-size: 40upx;
 			color: #06B4FD;
 		}

 		.icon-xuanzhong2 {
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 60upx;
 			height: 60upx;
 			font-size: 40upx;
 			color: $base-color;
 		}

 		.tit {
 			font-size: 32upx;
 			color: $font-color-dark;
 			flex: 1;
 		}
 	}

 	.footer {
 		position: fixed;
 		left: 0;
 		bottom: 0;
 		z-index: 995;
 		display: flex;
 		align-items: center;
 		width: 100%;
 		height: 90upx;
 		justify-content: space-between;
 		font-size: 30upx;
 		background-color: #fff;
 		z-index: 998;
 		color: $font-color-base;
 		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

 		.price-content {
 			padding-left: 30upx;
 		}

 		.price-tip {
 			color: red;
 			margin-left: 8upx;
 		}

 		.price {
 			font-size: 36upx;
 			color: red;
 		}

 		.submit {
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 280upx;
 			height: 100%;
 			color: #fff;
 			font-size: 32upx;
 			background-color: #50d0af;
 		}
 	}

 	/* 优惠券面板 */
 	.mask {
 		display: flex;
 		align-items: flex-end;
 		position: fixed;
 		left: 0;
 		top: var(--window-top);
 		bottom: 0;
 		width: 100%;
 		background: rgba(0, 0, 0, 0);
 		z-index: 9995;
 		transition: .3s;

 		.mask-content {
 			width: 100%;
 			min-height: 30vh;
 			max-height: 70vh;
 			background: #f3f3f3;
 			transform: translateY(100%);
 			transition: .3s;
 			overflow-y: scroll;
 		}

 		&.none {
 			display: none;
 		}

 		&.show {
 			background: rgba(0, 0, 0, .4);

 			.mask-content {
 				transform: translateY(0);
 			}
 		}
 	}

 	/* 优惠券列表 */
 	.coupon-item {
 		display: flex;
 		flex-direction: column;
 		margin: 20upx 24upx;
 		background: #fff;

 		.con {
 			display: flex;
 			align-items: center;
 			position: relative;
 			height: 120upx;
 			padding: 0 30upx;

 			&:after {
 				position: absolute;
 				left: 0;
 				bottom: 0;
 				content: '';
 				width: 100%;
 				height: 0;
 				border-bottom: 1px dashed #f3f3f3;
 				transform: scaleY(50%);
 			}
 		}

 		.left {
 			display: flex;
 			flex-direction: column;
 			justify-content: center;
 			flex: 1;
 			overflow: hidden;
 			height: 100upx;
 		}

 		.title {
 			font-size: 32upx;
 			color: $font-color-dark;
 			margin-bottom: 10upx;
 		}

 		.time {
 			font-size: 24upx;
 			color: $font-color-light;
 		}

 		.right {
 			display: flex;
 			flex-direction: column;
 			justify-content: center;
 			align-items: center;
 			font-size: 26upx;
 			color: $font-color-base;
 			height: 100upx;
 		}

 		.price {
 			font-size: 44upx;
 			color: $base-color;

 			&:before {
 				content: '￥';
 				font-size: 34upx;
 			}
 		}

 		.tips {
 			font-size: 24upx;
 			color: $font-color-light;
 			line-height: 60upx;
 			padding-left: 30upx;
 		}

 		.circle {
 			position: absolute;
 			left: -6upx;
 			bottom: -10upx;
 			z-index: 10;
 			width: 20upx;
 			height: 20upx;
 			background: #f3f3f3;
 			border-radius: 100px;

 			&.r {
 				left: auto;
 				right: -6upx;
 			}
 		}
 	}

 	.tick {
 		margin-right: -40rpx;
 	}

 	.word {
 		margin-right: 20rpx;
 	}

 	.tip {
 		margin-top: 30rpx;
 	}
 </style>