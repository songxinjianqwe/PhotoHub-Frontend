// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import Layout from '@/components/Layout'
import Util from '@/plugins/utility.js'
import { Message } from 'element-ui'
axios.defaults.baseURL = 'http://localhost:8080'
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('loginResult') !== null) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authentication = JSON.parse(localStorage.getItem('loginResult')).token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          Message.error('登录凭证过期，请重新登录')
          localStorage.clear('loginResult')
          router.replace({
            path: '/',
            query: { redirect: router.currentRoute.fullPath }
          })
        case 500:
          
      }
    }
    return Promise.reject(error)   // 返回接口返回的错误信息
  });
Vue.use(ElementUI)
Vue.use(Util)
// 这样所有Vue组件中都可以通过this.axios来使用
Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  // 挂载在index.html中的<div id='app'>中
  el: '#app',
  router,
  template: '<Layout/>',
  components: { Layout }
})

