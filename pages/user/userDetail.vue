<template >
	
 <u-form :model="form" ref="uForm" class="topBor"> 
 <view class="  u-m-60">
	  <u-form-item label="昵称:"><u-input v-model="userName" /></u-form-item>
	  <u-form-item  label-width="130" label="绑定手机:"  >
	   <u-input v-model="mobile" :disabled="true" @click="update"/>
	   <text class="cell-more yticon icon-you"></text>
	  </u-form-item>
 </view>
  <view class="u-font-xl topBor u-p-30">基本信息</view>
  <view class="  u-m-60">
	  <u-form-item label-width="130" label="真实姓名:">
	  <view class="approve u-flex" ><view>{{trueName}}</view>
	  <view class="red"><u-button size="mini" v-if="trueName =='未实名'" type="error" @click="goTrueName">去认证</u-button></view>
	  </view>
	  </u-form-item>
		  <u-form-item label-width="130" label="性别:">
			<view  @click=" show = true">{{label}}</view>
			<u-select v-model="show" :list="typeList"  @confirm="confirma"></u-select>
			</u-form-item>
	  <u-form-item label="年龄:"><u-input v-model="extendS1"/></u-form-item>
	  

	  
	  
	  
   
   <u-button @click="confirm()" class="saveBtn">确认修改</u-button>
   </view>
 </u-form>
</template>

<script>
 export default {
  data() {
   return {
	userName:'',
	mobile:'',
    label:'选择性别',
	value:'',
	sex:'',
	typeList: [{
			value: '1',
			label: '男'
		},
		{
			value: '2',
			label: '女'
		}],
	show: false,
	extendS1:"",
    trueName :'',
};
  },
  async onShow() {
  
    let personalMap = await this.$u.post('/work_ymgj/user/getUserData');
	if(personalMap.user.sex=="1"){
		this.label="男"
	}else if(personalMap.user.sex=="2"){
		this.label="女"
	}
	this.value = personalMap.user.sex
   this.extendS1 = personalMap.user.extend.extendS1;
    this.trueName = personalMap.trueName;
    this.mobile = personalMap.user.mobile;
     this.userName = personalMap.user.userName;
    },
  methods: {
  
   //提交
    confirm: async function(){    
    if(!/^(?:[1-9][0-9]?|1[01][0-9]|120)$/.test(this.extendS1)){
     this.$api.msg('年龄范围 0~120');
     return;
    };
	if(this.userName.replace(/\s+/g,'')==''){
		uni.showToast({
			title:"请输入正确的姓名",
			icon: 'none',
		});
		return;
	};
    let result =await this.$u.post('/work_ymgj/user/updateData',{name:this.userName,sex:this.sex,extendS1:this.extendS1})
    if(result){
     this.$api.msg("修改成功");
     setTimeout(()=>{
      uni.navigateBack()
     }, 800)
    }
    
    
   },
   confirma(e) {
   	this.label = e[0].label;
   	this.value = e[0].value;
	this.sex = e[0].value;
   },
    async update(){
   	  var test = await this.$u.post('/work_ymgj/user/getMobile')
   		uni.navigateTo({
   			url: `/pages/user/verificationMobile?mobile=${test.data}`
   		})
   },
   goTrueName(){
    uni.navigateTo({
     url: '/pages/user/authentication'
    })
   },
   
   exit(){
    uni.navigateTo({
     url: '/pages/login/login'
    })
   },
  }
 }
</script>

<style lang="scss">
.topBor{
 border-top: 18rpx solid #f5f5f5;
}
.borBom{ border-bottom: 0.5px solid #e6e6e6; }
.exitBtn{
 width: 690rpx;
 border-radius: 60rpx;
 padding: 24rpx 0;
 margin: 80rpx 30rpx 30rpx;
 text-align: center;
 font-size: 30rpx;
 color: #fff;
 background: #29CCAB;
 box-shadow: 0px 3px 8px rgba(82, 214, 165, 0.43);
}

.saveBtn{
 width: 100%;
 border-radius: 60rpx;
 padding: 24rpx 0;
 margin-top: 80rpx;
 text-align: center;
 font-size: 30rpx;
 color: #fff;
 background: #29CCAB;
 box-shadow: 0px 3px 8px rgba(82, 214, 165, 0.43);
}
.aaa{
	width: 40rpx;
	height: 40rpx;
	font-size: 12rpx;
	// border-radius: 50rpx;
}
.red{
	margin-left: 30rpx;
}
</style>