import Vue from 'vue';
import App from './App';
import {
	VUE_APP_API_URL,
	VUE_APP_RESOURCES_URL
} from "@/config.js";



Vue.config.productionTip = false;

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView提供的对vuex的简写法文件
let qyCommon = require('@/common/qycommon.js');
Vue.mixin(qyCommon);

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

const app = new Vue({
	store,
	...App
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

//设置请求地址
uni.$u.vuex('vuex_baseUrl', VUE_APP_API_URL);
uni.$u.vuex('vuex_baseImgUrl', VUE_APP_RESOURCES_URL);


Vue.config.devtools = process.env.NODE_ENV !== "production";

/**
 * 测试函数,之后需要删除
 */
import Json from './Json' //测试用数据

/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	if(!prePage){
		return null;
	}
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.prototype.$fire = new Vue();
Vue.prototype.$api = {msg, json, prePage};



app.$mount()