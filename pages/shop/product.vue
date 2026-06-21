<template>
	
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item v-if="video">
					<view v-html="html"></view>
				</swiper-item>
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="vuex_baseImgUrl+item"  
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
			<text class="title">{{product.name}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{product.price}}</text>
				<text class="m-price">¥{{product.otPrice}}</text>
		<!-- 		<text class="coupon-tip">{{parseFloat(product.price/product.otPrice*10).toFixed(1) }}折</text> -->
			</view>
			<view class="bot-row">
				<text>销量: {{product.ficSales+product.sales}}	</text>
				<text>库存: {{product.stock == -1 ?"无限":product.stock}}</text>
				<text>可抵扣积分: {{product.maxIntegral}}</text>
			</view>
		</view>
		<!--  分享 -->
	<!-- 	<view class="share-section" @click="share">
			<text class="tit"></text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
			</view> -->
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec('buy')">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<!-- <view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">商品介绍</text>
				<view class="con-list">
					<u-parse :html="product.info"></u-parse>
				</view>
			</view>
			<view class="c-row b-b" v-if="data.member">
				<text class="tit">购买升级会员至</text>
				<view class="con-list">
					<u-parse :html="data.member"></u-parse>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>正品保证 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
<!-- 		<view class="eva-section" @click="toComment(pid)">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{num}})</text>
				<text class="tip">好评率 {{feedback}}%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" :src="vuex_baseImgUrl+user_avatar" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{user_name}}</text>
					<text class="con">{{comment}}</text>
					<view class="bot">
						<text class="attr"></text>
						<text class="time">{{create_date}}</text>
					</view>
				</view>
			</view>
		</view> -->
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<view class="u-content">
				<u-parse :html="product.description" :autoscroll="true" :tag-style="tagStyle"  ></u-parse>
			</view>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom"  :style="enablecartStyle">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator v-if="enablecart!='0'"  url="/pages/shop/cart" open-type="switchTab"  class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
				
			
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" style="background-color: #606266;" v-if="canBuyProduct=='false'" >已经购买</button>
				<button type="primary" class=" action-btn no-border buy-now-btn" v-if="canBuyProduct!='false'"  @click="buy">立即购买</button>
				<button v-if="enablecart!='0'" type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec('close')"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="vuex_baseImgUrl+product.image"></image>
					<view class="right">
						<text class="price">¥{{product.price}}</text>
						<text class="stock">库存：{{product.stock == -1 ?"无限":product.stock+"件"}}</text>
						<view class="u-flex">
						<text class="stock">购买数量：</text>
						<view class="jia"><u-number-box input-width="50" input-height="40" :min="1" :disabled-input="true" v-model="buyNum" @change="valChange"></u-number-box></view>
						</view>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in item.valueList" 
							:key="childIndex" class="tit"
							:class="{selected: childItem.sel}"
							@click="selectSpec(index,childIndex, childItem)"
						>
							{{childItem.value}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec" v-if="buyType=='buy'">立即购买</button>
				<button class="btn" @click="toggleSpec" v-if="buyType=='cart'">加入购物车</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	export default{
		components: {
			share
		},
		data() {
			return {
				buyNum:1,
				num:"0",
				feedback:100,
				user_avatar:"",
				user_name:"",
				comment:"",
				create_date:"",
				pid:"",
				data:{},
				product:{},
				specClass: 'none',
				buyType : "",
				specSelected:[],
				imgList:[],
				favorite: false,
				shareList: [],
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
				specList: [],
				AttrValueList:[],
				tagStyle: {
					img: 'float:left',
				},
				enablecart:'',
				enablecartStyle:'display:none;',
				canBuyProduct : '',
				ScoreBuyType:'',
				video: '',
				html:'<video muted controlslist="nodownload"	controls="controls"   src=""   style="height:100%"  autoplay="autoplay" webkit-playsinline="" playsinline="" ></video>'
			};
		},

		async onLoad(options){
			this.ScoreBuyType = options.buyType;
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			this.pid = options.id;
			
			
			// 评价
			let replyList = await this.$u.post("/html/plug_shop/shopindex/getShopProductReplyList",{pid:this.pid});
			
			this.num = replyList.num;
			if(replyList.num>0){
			this.feedback = replyList.feedback;
			this.user_avatar=replyList.data[0].avatar;
			this.user_name=replyList.data[0].userName;
			this.comment=replyList.data[0].comment;
			this.create_date=replyList.data[0].createDate;
			}
			
			let resultData = await this.$u.post("/html/plug_shop/shopindex/productDetail",{pid:this.pid});
			
			this.data = resultData;
			this.product = resultData.data;
			//拆分数据
			this.imgList = resultData.data.imageDetail.split("|");
			this.video = resultData.data.video;
			this.favorite=resultData.data.isFavorite
			//商品属性
			this.specList = resultData.data.shopProductAttrList;
			this.AttrValueList = resultData.data.shopProductAttrValueList;
			//是否开启购物车
			if(options.buyType == 6){
				this.enablecart = '0';
			}else{
				this.enablecart = resultData.enablecart;
			}
			
			if(resultData.data.openUpgrade==1){
				this.enablecart = 0;
			}
			if(this.enablecart == '0' ){
				this.enablecartStyle = "width: 460upx;left: 160upx;";
				this.enablecart = '0';
			}
			else{
				this.enablecartStyle = "";
			}
			
			//商品是否可购买
			this.canBuyProduct = resultData.canBuyProduct;
			
			
			if(this.specList.length == 0){
				this.specList.push({id:"-1",name:"默认",valueList:[{value:"默认",sel:true}]});
				this.specSelected[0] = "默认";
				
			}
			else{
				this.specList.forEach((item,index)=>{
					item.valueList[0].sel = true;
					this.specSelected[index] = item.valueList[0].value;
				})
				
				
			}
			
			
			// //规格 默认选中第一条
			// this.specList.forEach(item=>{
			// 	for(let cItem of this.specChildList){
			// 		if(cItem.pid === ite1m.id){
			// 			this.$set(cItem, 'selected', true);
			// 			this.specSelected.push(cItem);
			// 			break; //forEach不能使用break
			// 		}11
			// 	}
			// })
			this.shareList = await this.$api.json('shareList');
			//video赋值
			this.html = '<video muted="true" controlslist="nodownload"	controls="controls"   src="'+this.video+'"  style="width:410px; height:390px; object-fit: fill;" poster="'+this.imgList[0]+'"  preload="auto"   webkit-playsinline="true" playsinline="true"  loop="true"></video>'
			
		},

		methods:{
			valChange(e) {
				
			},
			share(){
				uni.share({
				    provider: 'weixin',
				    scene: "WXSceneSession",
				    type: 5,
					summary: this.product.productDesc,
				    imageUrl: this.product.image,
				    title: this.product.name,
				    miniProgram: {
				        id: 'gh_e6c95428a331',
				        path: `/pages/product/product?id=${this.product.id}`,
				        webUrl: `/pages/product/product?id=${this.product.id}`,
				        type: 0,
				    },
				    success: ret => {
				        console.log(JSON.stringify(ret));
				    }
				});
			},
			toComment(pid){
			
				uni.navigateTo({
					url: "/pages/shop/comment?pid="+pid
				})
			},
			//规格弹窗开关
			toggleSpec(type) {
				
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
					
					let skuName = "";
					for (var i=0;i<this.specSelected.length;i++)
					{ 
					   skuName += this.specSelected[i] + ",";
					}
				
					skuName = skuName.substr(0,skuName.length-1);
					if(this.product.stock>=0 &&this.product.stock-this.buyNum<0){
						this.$api.msg('商品库存不足');
						return;
					}
					if("buy" == this.buyType && type != 'close'){

						let checkList = [];
						let checkItem = {};					
						checkItem.pid = this.pid;						
						checkItem.sku = skuName;
						checkItem.buyNum = this.buyNum;
						checkList.push(checkItem);
						
						if(!this.vuex_hasLogin){
							let url = '/pages/login/login';
							uni.$u.route(url);
							return ;
						}
						
						
					
						uni.navigateTo({
										url: `/pages/shop/createOrder?data=${JSON.stringify({
											goodsData: checkList
										})}&buyType=1`
									})
					
						
						
					}
					else if("cart" == this.buyType && type != 'close'){
						this.vuex_shopcart.push({sku:skuName,pid:this.pid,image:this.product.image,name:this.product.name,price:this.product.price,otPrice:this.product.otPrice,buyNum:this.buyNum,checked:true});
						this.$u.vuex('vuex_shopcart', this.vuex_shopcart);
						
						uni.showToast({
						    title: "加入购物车成功",
						    duration: 1000
						});
					}
					
				}else if(this.specClass === 'none'){
					this.buyType = type;
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(skuIndex,itemIndex, skuValue){
				
				this.specList[skuIndex].valueList.forEach(item=>{
					if(item.sel == true){
						this.$set(item, "sel", false);
					}
				})
				this.$set(this.specList[skuIndex].valueList[itemIndex], "sel", true);
				
				this.specSelected[skuIndex] = skuValue.value;
				console.log(skuValue.value)
				let sku = '';
				this.specSelected.forEach((item,index)=>{
					if(sku==''){
					sku =item
					}else{
						sku = sku+","+item
					}
				})
				this.AttrValueList.forEach((item,index)=>{
									// console.log(item.sku)
					if(item.sku == sku){
						this.product.stock = item.stock
						this.product.price = item.price
					}
				})
			},
			
			//收藏
			async toFavorite(){
				this.favorite = !this.favorite;
				await this.$u.post("/plug_shop/shopuser/addShopFavorite",{pid:this.pid,type:'0'});
			},
			
			buy(){
				this.toggleSpec("buy");
			},
			addCart(){
				this.toggleSpec("cart");
			},
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}
	.u-content {
			width: 100%;
			white-space:pre-wrap;
			word-wrap:break-word;
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
	
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: red;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(to left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: #50d0af;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	.price-tip{
		color: red;
	}
	.jia{
		/* padding-left: 60rpx; */
	}
</style>
