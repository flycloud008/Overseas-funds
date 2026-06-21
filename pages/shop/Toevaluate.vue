<template>
	<view>
		<view class="add">
				<view class="uploading">
					
					<u-upload name="uploadFile" ref="uUpload"  max-count="6" :action="this.vuex_baseUrl+'/login/frontUploadFile'"  ></u-upload>
					
				</view>
				<view class="score u-flex"><view class="word">商品评分</view><u-rate :count="count" v-model="productScore"></u-rate></view>
				<view class="score u-flex"><view class="word">服务评分</view><u-rate :count="count" v-model="serviceScore"></u-rate></view>
				<view class="wire"></view>
				<view class="import"><u-input v-model="comment" type="textarea" :border="false" :height="height" :auto-height="true" /></view>
		</view>
		<view class="input"><u-button type="success"  @click="toSave">提交评价</u-button></view>

	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				comment: '',
				productScore:0,
				serviceScore:0,
				count:5,
				border: true,
				height: 200,
				// autoHeight: true,
				oid:'',
			};
		},		
			onLoad(oid){
				this.oid = oid.oid	
			},
			methods: {
				
				async toSave(){
					let files = [];
					// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
					files = this.$refs.uUpload.lists.filter(val => {
						return val.progress == 100;
					})
					
					let uploadFiles = [];
					files.forEach(function (item) {
					   uploadFiles.push(item.response.uploadFiles[0])
					});
					let cate = await this.$u.post("/plug_shop/shopuser/setShopProductReply",{oid:this.oid,productScore:this.productScore,serviceScore:this.serviceScore,comment:this.comment,image:JSON.stringify(uploadFiles)});
					uni.navigateBack();	
				},
			
				submit() {
					this.$refs.uUpload.upload();
				},
			}
		}
</script>

<style lang="scss">
page{
		background-color: #f5f5f5;
	}
	.add{
		width: 100%;
		background-color: #FFFFFF;
	}
	.uploading{
		margin-left: 20rpx;
	}
	.word{
		margin-left: 20rpx;
		margin-right: 20rpx;
	}
	.score{
		margin-top: 20rpx;
	}
	.wire{
		width: 710rpx;
		height: 1rpx;
		background-color:#e1e1e1;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}
	.import{
		margin-left: 20rpx;
		height: 200rpx;
	}
	.input{
		width: 710rpx;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}
</style>
