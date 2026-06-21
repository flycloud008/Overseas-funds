// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
import {
	VUE_APP_API_URL,
	VUE_APP_RESOURCES_URL,
	VUE_APP_DEBUG
} from "@/config.js";

const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: VUE_APP_API_URL,
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		originalData: true, 
		showLoading: true, // 是否显示请求中的loading
		loadingText: '努力加载中~',
		loadingTime: 800,
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'__ajax' : 'json',
			
		},
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.__sid = vm.vuex_token;
		if(VUE_APP_DEBUG){
			console.log("--请求参数--",JSON.stringify(config));
		}
		
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式，见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;
		
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的，所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		// console.log("--返回参数--");
		// console.log(res.data);
		
		if(VUE_APP_DEBUG){
			console.log("数据请求结果:"+JSON.stringify(res.data));
		}
		
		if(res.statusCode == 200) {
			if(res.data.result == "false"){
				uni.$u.toast(res.data.message);
				if(res.data.message=='清先完成实名认证'){
					setTimeout(function(){
							uni.$u.route("/pages/user/authentication",{back:true});
					},1000)
				
					return false
				}
				return null;  
			}
			else if(res.data.result == "login"){
				uni.$u.route("/pages/login/login",{back:true});
				return false;
			}
			return res.data;  
		} else{
			uni.$u.toast('请求失败,请稍后再试!');
			return false;
		}
		
	}
}

export default {
	install
}