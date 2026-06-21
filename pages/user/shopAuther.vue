<template>
	<view>
		<view v-if="extype =='-1'">
			<view class="bottom">
				<view><u-field label="商家名称:" v-model="name" placeholder="请输入商家名称"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="联系电话:" v-model="mobile" placeholder="请输入联系电话"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="信用码:" v-model="cardNum" placeholder="请输入统一社会信用代码"></u-field></view>
			</view>

			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">营业执照</view>
				<view class=""><u-upload ref="uUpload1" upload-text="营业执照" name="uploadFile"
						:action="this.vuex_baseUrl+'/login/frontUploadFile'" max-count="1"></u-upload></view>

			</view>


			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">门头照片</view>
				<view class=""><u-upload ref="uUpload2" upload-text="门头照片" name="uploadFile"
						:action="this.vuex_baseUrl+'/login/frontUploadFile'" max-count="1"></u-upload></view>

			</view>


			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">内饰照片</view>
				<view class=""><u-upload ref="uUpload3" upload-text="内饰照片" name="uploadFile"
						:action="this.vuex_baseUrl+'/login/frontUploadFile'" max-count="1"></u-upload></view>

			</view>

			<view class="bottom">
				<view><u-field label="详细地址:" v-model="address" placeholder="请输入详细地址"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="简介详情:" v-model="msg" placeholder="请输入简介详情" type="textarea"></u-field></view>
			</view>



			<view class="withdrawal"><u-button @click="withdraw">提交</u-button></view>
		</view>
		<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="extype =='1'">
			<u-image src="/static/temp/success.png" mode="widthFix"></u-image>
			<view class="u-m-t-30 u-content-co lor u-font-lg authentication">商户已认证</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{name}}</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{cardNum}}</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{address}}</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{mobile}}</view>
		</view>
		<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="extype =='0'">
			<u-image src="/static/temp/load2.png" mode="widthFix"></u-image>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">商户认证审核中...</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				cardNum: '',
				cardimg1:'',
				cardimg2:'',
				cardimg3:'',
				address:'',
				msg:'',
				mobile:'',
				extype:'-1'
			};
		},
		async onLoad() {
			this.loadData()
		},
		methods: {

			async loadData() {
				let res = await this.$u.post("/work_ddl/user/userShoperAuthenStatus");
				if(res.data){
					this.extype = res.data.extype
					this.name = res.data.name
					this.cardNum = res.data.cardNum
					this.address = res.data.address
					this.mobile = res.data.mobile
				}
			
			},

			areaConfirm(e) {
				var text = "";
				for (let item of e) {
					text += item.label + " "
				}

				this.area = text;
				this.areaCode = e[e.length - 1].value
			},

			async withdraw() {
				// if (this.trueName.replace(/\s+/g, '') == '') {
				// 	uni.showToast({
				// 		title: "请输入正确的姓名",
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
			
				let file1 = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				file1 = this.$refs.uUpload1.lists.filter(val => {
					return val.progress == 100;
				})
				let uploadFile1 = [];
				file1.forEach(function(item) {
					uploadFile1.push(item.response.uploadFiles[0])
				});

				let file2 = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				file2 = this.$refs.uUpload2.lists.filter(val => {
					return val.progress == 100;
				})
				let uploadFile2 = [];
				file2.forEach(function(item) {
					uploadFile2.push(item.response.uploadFiles[0])
				});


				let file3 = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				file3 = this.$refs.uUpload3.lists.filter(val => {
					return val.progress == 100;
				})
				let uploadFile3 = [];
				file3.forEach(function(item) {
					uploadFile3.push(item.response.uploadFiles[0])
				});

				let cate = await this.$u.post("/work_ddl/user/userShoperAuthen", {
					
					name: this.name,
					cardNum: this.cardNum,
					cardimg1: uploadFile1[0],
					cardimg2: uploadFile2[0],
					cardimg3: uploadFile3[0],
					address: this.address,
					msg: this.msg,
					mobile: this.mobile,
				});
				if (cate) {
					uni.navigateBack();
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f2f6;
	}

	.title {
		margin-left: 30rpx;
	}

	.classify {
		margin-right: 350rpx;

	}

	.content {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}

	.top {
		width: 686rpx;
		height: 160rpx;
		background: #ffffff;
		border-radius: 16rpx;
		margin-top: 24rpx;
		margin-left: 30rpx;
	}

	.bottom {
		width: 686rpx;
		background: #ffffff;
		border-radius: 16rpx;
		margin-top: 25rpx;
		margin-left: 30rpx;
	}

	.withdrawal button {
		width: 690rpx;
		height: 80rpx;
		background: #50d0af;
		;
		border-radius: 50rpx;
		color: #FFFFFF;
		margin-top: 56rpx;
	}

	.line {
		width: 0rpx;
		height: 74rpx;
		opacity: 1;
		border: 2rpx solid #efefef;
		margin-left: 190rpx;
		margin-top: -45rpx;
	}

	.mode {
		padding-top: 66rpx;
		padding-left: 32rpx;
	}

	.bank {
		margin-left: 252rpx;
		margin-top: -70rpx;
	}

	.title {
		font-size: 24rpx;
		font-weight: 700;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.quota {
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
	}

	.ico {
		color: #999999;
		margin-top: -35rpx;
		margin-left: 350rpx;
	}

	.bankcard {
		margin-left: 16rpx;
		margin-right: 24rpx;
	}

	.money {
		font-size: 36rpx;
		font-weight: 500;
		color: #666666;
		padding-top: 32rpx;
		margin-left: 32rpx;
	}

	.input {
		margin-left: 32rpx;
		margin-top: 106rpx;
	}

	.ico2 {
		color: #999999;
		margin-top: 150rpx;
		margin-right: 27rpx;
	}

	.authentication {
		font-size: 32rpx;
		font-weight: 700;

	}

	.uploading {
		width: 686rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 25rpx;
		margin-left: 30rpx;
	}

	.title2 {
		font-weight: 700;
		margin-left: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.addition {
		margin-left: 80rpx;
		margin-bottom: 20rpx;
	}

	.addition2 {
		margin-top: 60rpx;
		margin-left: 80rpx;
	}
</style>