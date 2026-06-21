<template>
	<view>
		<view v-if="userCardFlag =='0'">
			<view class="bottom">
				<view><u-field label="真实姓名:" v-model="trueName" placeholder="请输入真实姓名"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="身份证号:" v-model="bankName" placeholder="请输入身份证号"></u-field></view>
			</view>

			<view class="bottom">
				<u-field label="省市区:" v-model="area" placeholder="请选择省市区"  :disabled="true"  @click="show = true"></u-field>
				 <u-select v-model="show" mode="mutil-column-auto" :list="items" @confirm="areaConfirm" value-name="areaCode" label-name="areaName" child-name="childList" ></u-select>
			</view>

		<!-- 	<view class="uploading u-flex">
				<view>
					<view class="title2">上传身份证照片</view>
					<view class="addition"><u-upload ref="uUpload" upload-text="选择正面" name="uploadFile"
							:action="this.vuex_baseUrl+'/login/frontUploadFile'" max-count="1"></u-upload></view>
				</view>
				<view>
					<view class="addition2"><u-upload ref="uUploads" upload-text="选择反面" name="uploadFile"
							:action="this.vuex_baseUrl+'/login/frontUploadFile'" max-count="1"></u-upload></view>
				</view>
			</view> -->



			<view class="withdrawal"><u-button @click="withdraw">提交</u-button></view>
		</view>
		<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="userCardFlag =='1'">
			<u-image src="/static/temp/success.png" mode="widthFix"></u-image>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">已实名认证</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{name}}</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{userCard}}</view>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">{{areaName}}</view>
		</view>
		<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="userCardFlag =='2'">
			<u-image src="/static/temp/load2.png" mode="widthFix"></u-image>
			<view class="u-m-t-30 u-content-color u-font-lg authentication">实名认证审核中...</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				trueName: '',
				bankName: '',
				userCardFlag: '',
				items: [],
				show:false,
				area:'',
				areaCode :'',
				userCard: '',
				areaName: '',
			};
		},
		async onLoad() {
			this.loadData()
		},
		methods: {

			async loadData() {
				let userInfoDetail = await this.$u.post("/user/getUserinfoDetail");
				this.name = userInfoDetail.data.member.trueName;
				this.userCardFlag = userInfoDetail.data.member.userCardFlag;
				this.userCard = userInfoDetail.data.member.userCard;
				this.areaName = userInfoDetail.data.member.ipCity;
				
				let area = await this.$u.post("/work_ddl/user/getAreaList");
				this.items = area.data
			},
			
			areaConfirm(e){
				var text = "";
				for (let item of e) {
					text += item.label+" "
				}
				
				this.area = text;
				this.areaCode = e[e.length -1 ].value
			},
		
			async withdraw() {
				if (this.trueName.replace(/\s+/g, '') == '') {
					uni.showToast({
						title: "请输入正确的姓名",
						icon: 'none'
					});
					return;
				} 
				 if (this.bankName.replace(/\s+/g, '') == '') {
					uni.showToast({
						title: "请输入正确的身份证号",
						icon: 'none'
					});
					return;
				}
				 if( this.areaCode == ''){
					 uni.showToast({
					 	title: "请选择所在省市区",
					 	icon: 'none'
					 });
					 return;
				 }
				// let file = [];
				// // 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				// file = this.$refs.uUpload.lists.filter(val => {
				// 	return val.progress == 100;
				// })
				// let uploadFile = [];
				// file.forEach(function(item) {
				// 	uploadFile.push(item.response.uploadFiles[0])
				// });

				// let files = [];
				// // 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				// files = this.$refs.uUploads.lists.filter(val => {
				// 	return val.progress == 100;
				// })
				// let uploadFiles = [];
				// files.forEach(function(item) {
				// 	uploadFiles.push(item.response.uploadFiles[0])
				// });
				let cate = await this.$u.post("/work_ddl/user/authentication", {
					cardType: 1,
					trueName: this.trueName,
					userCard: this.bankName,
					areaCode: this.areaCode
					// cardImage1: uploadFile[0],
					// cardImage2: uploadFiles[0]
				});
				if (cate) {
					uni.navigateBack({
						delta: 2
					});
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
		height: 84rpx;
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