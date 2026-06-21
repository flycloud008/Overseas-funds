<template>
	<view class="poster_page">
		
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
		<swiper class="poster_swiper" previous-margin="110rpx" circular :current="swiperIndex" next-margin="110rpx" @change="onSwiperChange">
			<swiper-item v-for="(item, index) of dataInfo.headImgs" :key="index">
				<view class="goods_info_box" :class="{ active: swiperIndex == index }">
					<image class="goods_image" :src="item.img" mode="aspectFill"></image>
					<view class="goods_info">
						<view class="poster_info">
							<view class="info">
								<view class="u-flex"   >
									<!-- <view class="avatar-wrap" >
										<image class="avatar" :src="userAvator"></image>
									</view> -->
									<view class="u-flex u-flex-col  u-row-between u-flex-nowrap" style="height: 65upx; padding-left: 15upx;">
										<view class="u-line-1">昵称: {{vuex_userInfo.userName}}</view>
										<view class="u-line-1">推荐码: {{vuex_userInfo.member.refNumber}}</view>
									</view>
								</view>
								
								
								<view style="margin-top: 20upx; font-size: 12px;">扫码或长按识别二维码</view>
								
							</view>
							<canvas  canvas-id="qrcode" class="canvas-hide" :style=" { width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}"  />
							
							<image class="poster_code_image" :src="qrcode" ></image>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="share_save_box" >
			<!-- #ifdef MP -->
			<!-- <button open-type="share"> 
				<image src="/static/ic_pic.png" mode="aspectFit"></image>
				<text>发给好友</text> 
			</button> -->
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<!-- <button @click="onAppShare">
				<image src="/static/ic_pic.png" mode="aspectFit"></image>
				<text>发给好友</text>
			</button> -->
			<!-- #endif -->
			<button class="onSave" @click="onSaveImg">
				<image src="/static/ic_weixin.png" mode="aspectFit"></image>
				<text>保存图片</text>
			</button>
		</view>
		<!-- #ifdef H5 -->
		<view class="h5_press_save" v-if="h5SaveImg" @click="h5SaveImg = ''">
			<image :src="h5SaveImg" mode="widthFix"></image>
			<button class="download">长按图片保存图片</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>

let settingWritePhotosAlbum = false;
import uQRCode from '@/components/uqrcode.js'
export default {
	data() {
		return { 
			qrcodeSize: uni.upx2px(500),
			qrcode : '' , //二维码
			swiperIndex: 0,
			posterImgs: [],
			dataInfo: {
				headImgs: [],
				share: {
					shareContent: "商家云系统,点击了解",
					shareImg: "http://qn.kemean.cn/file/upload/202005/21/1590043402088i2jxb79n.jpg?imageView2/0/w/800",
					shareTitle: "冰希黎巴黎红精粹沙龙香水50ml",
					shareUrl: "http://kemean.com/download/3jiayunbz/index.htmlpages/mall/shopPage/goodsDetail?objId=18111505&recommendCode=32029043"
				}
			},
			h5SaveImg: "",
			userAvator:'',
		};
	},
	//第一次加载
	async onLoad(e) {
		var that = this;
		
		let userinfo = await this.$u.post("/login/getLoginUserinfo");
		this.vuex_updateUser(userinfo);	
		
		let carouselList = await this.$u.post('/html/app/banner',{type:3});
		if(!carouselList){return ;}
		this.dataInfo.headImgs = carouselList;
		 // 同步等待 
		  var res = await uQRCode.make({
			canvasId: 'qrcode',
			text: "https://wap.shengyuanjk.cn/#/pages/login/registor?regCode="+that.vuex_userInfo.member.refNumber,
			size:  uni.upx2px(500),
			margin:0,
			backgroundColor: 'rgba(255,255,255,0)',
			fileType: 'jpg',
			errorCorrectLevel: uQRCode.errorCorrectLevel.L
		  })
		  this.qrcode = res;
		
		  this.userAvator = this.vuex_baseImgUrl+userinfo.userinfo.avatarUrl;
		  if(userinfo.userinfo.avatarUrl.startsWith("/ctxPath") || !this.userAvator || this.userAvator==''){
		  	 this.userAvator = "../../static/missing-face.png";
		  }
	}, 
	// this.vuex_baseUrl+
	//方法 
	methods: {  
		// 轮播图变化
		onSwiperChange(e) {
			this.swiperIndex = e.detail.current;
		},
		// 创建海报
		createPoster() {
			let that = this;
			
			
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '海报生成中'
				});
				const ctx = uni.createCanvasContext('poster');
				ctx.fillRect(0, 0, 375, 673);
				ctx.setFillStyle("#FFF");
				ctx.fillRect(0, 0, 375, 673);
				uni.downloadFile({
					url:  this.vuex_baseUrl+"/html/work_ddl/index/downimage?path=" +this.dataInfo.headImgs[this.swiperIndex].img.substring(this.dataInfo.headImgs[this.swiperIndex].img.indexOf("/userfiles")),
					success: (res) => {
						if (res.statusCode === 200) {
							ctx.drawImage(res.tempFilePath, 0, 0, 375, 490);
							uni.downloadFile({
								url: that.userAvator,
								success: (res2) => {
									if (res.statusCode === 200) {
										let textLeft = 58;
										let textTop = 430;
										// 商品分割线
										ctx.beginPath();
										ctx.setLineWidth(1);
										ctx.moveTo(17, textTop + 70);
										ctx.lineTo(358, textTop + 70);
										ctx.setStrokeStyle('#eee');
										ctx.stroke();
										// 长按识别二维码访问
										ctx.setFontSize(19);
										ctx.setFillStyle('#333');
										ctx.fillText("扫码或长按识别二维码", 17, textTop + 200);
										
										// // 头像
										// ctx.drawImage(res2.tempFilePath, 17, textTop + 110, 70, 70);
										// 昵称
										ctx.setFontSize(16);
										ctx.setFillStyle('#999');
										ctx.fillText("昵称: "+ (this.vuex_userInfo.userName.length>5?this.vuex_userInfo.userName.substring(0,5)+"...":this.vuex_userInfo.userName) , 17, textTop + 110);
										// 推荐码
										ctx.setFontSize(16);
										ctx.setFillStyle('#999');
										ctx.fillText("推荐码: "+this.vuex_userInfo.member.refNumber, 17, textTop + 140);
										// 二维码
										ctx.drawImage(that.qrcode, 238, textTop + 80, 110, 110);
										ctx.draw(true, () => {
											// canvas画布转成图片并返回图片地址
											uni.canvasToTempFilePath({
												canvasId: 'poster',
												width: 375,
												height: 673,
												success: (res) => {
													if(this.posterImgs[this.swiperIndex]){
														this.posterImgs[this.swiperIndex].temporary = res.tempFilePath;
													}else{
														this.posterImgs[this.swiperIndex] = {
															temporary: res.tempFilePath
														}; 
													}
													console.log("海报制作成功！");
													resolve(res.tempFilePath);
												},
												fail: () => {
													uni.hideLoading();
													reject();
												}
											})
										});
									} else {
										uni.hideLoading();
										uni.showToast({
											title: '海报制作失败，图片下载失败',
											icon: 'none'
										});
									}
								},
								fail: err => {
									uni.hideLoading();
									uni.showToast({
										title: '海报制作失败，图片下载失败',
										icon: 'none'
									});
								}
							});
						} else {
							uni.hideLoading();
							uni.showToast({
								title: '海报制作失败，图片下载失败',
								icon: 'none'
							});
						}
					},
					fail: err => {
						uni.hideLoading();
						uni.showToast({
							title: '海报制作失败，图片下载失败',
							icon: 'none'
						});
					}
				});
			});
		},
		// 保存图片 
		async onSaveImg() {
			let imgUrl = "";
			console.log(1)
			if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].temporary){
				imgUrl = await this.posterImgs[this.swiperIndex].temporary;
				
			}else{
				console.log(3)
				imgUrl = await this.createPoster();
				console.log("3.1")
				
			}
			// #ifdef H5
			this.h5SaveImg = imgUrl;
			uni.hideLoading();
			// #endif
			// #ifdef MP-WEIXIN
			uni.showLoading({
				title: '海报下载中'
			});
			if (settingWritePhotosAlbum) {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.writePhotosAlbum']) {
							uni.saveImageToPhotosAlbum({
								filePath: imgUrl,
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '请先在设置页面打开“保存相册”使用权限',
								confirmText: '去设置',
								cancelText: '算了',
								success: data => {
									if (data.confirm) {
										uni.hideLoading();
										uni.openSetting();
									}
								}
							});
						}
					}
				});
			} else {
				settingWritePhotosAlbum = true;
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: () => {
						uni.saveImageToPhotosAlbum({
							filePath: imgUrl,
							success: () => {
								uni.hideLoading();
								uni.showToast({
									title: '保存成功'
								});
							}
						});
					}
				});
			}
			// #endif
			// #ifdef APP-PLUS
			console.log("3333")
			uni.showLoading({
				title: '海报下载中'
			});
			uni.saveImageToPhotosAlbum({
				filePath: imgUrl,
				success: () => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功'
					});
				}
			});
			// #endif
		},
		async onAppShare() {
			// let imgUrl = "";
			// if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].url){
			// 	imgUrl = this.posterImgs[this.swiperIndex].url;
			// } else if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].temporary){
			// 	let imgData = await this.$http.qnFileUpload([this.posterImgs[this.swiperIndex].temporary]);
			// 	imgUrl = imgData[0];
			// }else{
			// 	let data = await this.createPoster();
			// 	let imgData = await this.$http.qnFileUpload([data]);
			// 	imgUrl = imgData[0];
			// }
			// uni.hideLoading();
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				title: this.dataInfo.share.shareTitle,
				href: this.dataInfo.share.shareUrl,
				summary: this.dataInfo.share.shareContent,
				imageUrl: this.dataInfo.share.shareImg,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
	
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		let dataInfo = this.dataInfo;
		let shareInfo = {
			path: "/pages/home/shop/goodsDetail?objId="+dataInfo.objId,
			title: dataInfo.share.shareTitle,
			imageUrl: dataInfo.share.shareImg
		};
	
		return shareInfo;
	}
};
</script>
<style lang="scss" scoped>
.canvas-hide {
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		 z-index: -9999;
		opacity: 0;
}
page{
	background-color: #f5f5f5;
} 
.poster_page {
	min-height: calc((94vh )); 
	background-color: #f5f5f5;
	display: flex;
	align-items: center;
	// padding-top: 80upx;
}
.poster_canvas {
	width: 750rpx;
	height: 1334rpx;
	position: fixed;
	top: -10000rpx;
	left: 0rpx;
}
.poster_swiper {
	height: 950rpx;
	width: 100%;
	swiper-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.goods_info_box {
			width: 100%;
			height: 100%;
			transform: scale(0.88);
			transition: all 0.4s;
			position: relative;
			overflow: hidden;
			background-color: #FFFFFF;
			&.active {
				transform: scale(1);
			}
			.goods_image {
				width: 100%;
				height: calc(100vw);
			}
			.goods_info {
				padding: 24rpx;
				padding-top: 0px;
				.goods_name {
					color: #333;
					font-size: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.price_box {
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					.price {
						font-size: 38rpx;
						color: red;
					}
					.store_price {
						margin-left: 30rpx;
						font-size: 26rpx;
						color: #999;
						text-decoration: line-through;
					}
				}
				.poster_info {
					border-top: 2rpx solid #f1f1f1;
					padding-top: 5rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.info {
						display: flex;
						flex-direction: column;
						view {
							color: #333;
							font-size: 28rpx;
						}
						text {
							color: #999;
							font-size: 24rpx;
							margin-top: 20rpx;
						}
						.u-line-1{
							color: #333;
							font-size: 20rpx;
							width: 200upx;
						}
					}
					.poster_code_image {
						width: 150rpx;
						height: 150rpx;
						flex-shrink: 0;
					}
					.avatar-wrap {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;
						overflow: hidden;
					
						.avatar {
							width: 100%;
							height: 100%;
						}
					}
					
				}
			}
		}
	}
}
.share_save_box {
	position: fixed;
	bottom: calc((100vh - 950rpx - 240rpx) / 4);
	left: 0;
	z-index: 6;
	width: 100%;
	display: flex;
	background-color: #f5f5f5;
	justify-content: space-around;
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
		image {
			width: 60rpx;
			height: 60rpx;
		}
		text {
			font-size: 24rpx;
			color: #333333;
		}
	}
}
.h5_press_save {
	background-color: #000;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	z-index: 100;
	image {
		width: 100%;
	}
	.download {
		font-size: 24rpx;
		color: #ffffff;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		padding: 5rpx 30rpx;
		border-radius: 40rpx;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		&:before {
			content: '';
			background-image: url('/static/icon_download.png');
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			width: 24rpx;
			height: 24rpx;
			margin-right: 15rpx;
		}
	}
}
button {
	margin: 0;
	padding: 0;
	background-color: #FFFF;
}
button::after {
	border: none;
}
</style>
