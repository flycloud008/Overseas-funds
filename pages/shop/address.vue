<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" >
			<view class="wrapper" @click="checkAddress(item)">
				<view class="address-box">
					<text v-if="item.isDefault" class="tag">默认</text>
					<text class="address">{{item.address}} {{item.detail}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.realName}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<view class="delete" @click="deleteArticle(item.id)"><u-image src="/static/template/shanchu.png"  height="50rpx" width="50rpx"></u-image></view> 
		</view>
		
		<u-empty text="无数据" mode="data" :show="addressList.length == 0" margin-top="300" ></u-empty>
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList: [],
				prizeId: "",
			}
		},
		onShow(){
			
		},
		
		async onLoad(option){
			this.prizeId = option.prizeId;
			this.source = option.source;
			this.loadData();
		},
		methods: {
			//选择地址
			async checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}else if(this.source == 2){
					uni.showModal({
					    content: '确定领取到该地址吗',
					    success:async (e)=>{
					    	if(e.confirm){
								let result = await this.$u.post("/plug_shop/shopuser/honoree",{id:this.prizeId,addId: item.id});
								if(result){
									uni.navigateTo({
										url: `/pages/shop/turntable`
									})
								}
					    	}
					    }
					});
				}
			},
			async loadData(){
				let result = await this.$u.post("/plug_shop/shopuser/address");
				this.addressList = result.data;
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/shop/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			async deleteArticle(id){
				let deletes = await this.$u.post("/plug_shop/shopuser/deleteAddres",{id:id});
				if(deletes.result=="true"){
					if(typeof(this.$api.prePage().addressData) != 'undefined'){
						if(id==this.$api.prePage().addressData.id){
							this.$api.prePage().addressData = {};
							this.$api.prePage().addressData = undefined;
						}
					}
						
				}
				this.loadData();
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				this.loadData();
			}
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
.delete{
     /* u-image{ */

		 margin-left: 40rpx;
		 
	 /* } */
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
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px #2ccda9;	
		background-color: #2ccda9;
	}
</style>
