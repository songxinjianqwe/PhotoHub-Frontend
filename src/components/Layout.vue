<template>
  <div>
    <!-- Header -->
    <div class="app-header">
      <div class="app-header-inner">
        <!-- LOGO -->
        <router-link to="/" class="logo">
          <h1>PhotoHub</h1>
        </router-link>
      
        <!-- 导航条 -->
        <div class="header-nav">
          <el-menu class="nav-menu" :default-active="$route.path" :router="true" mode="horizontal" background-color="#24292c" text-color="#999" active-text-color="#ffffff">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item :index="'/users/'+loginResult.id+'/index'">主页</el-menu-item>
            <el-menu-item :index="'/users/'+loginResult.id+'/moments'">动态</el-menu-item>
            <el-menu-item :index="'/users/'+loginResult.id+'/albums'">相册</el-menu-item>
            <el-menu-item index="/activities">活动</el-menu-item>
            <el-menu-item :index="'/users/'+loginResult.id+'/follows'">关注</el-menu-item>
            <el-menu-item index="/tags">标签</el-menu-item>
            <el-submenu v-if="isLogin" :index="'/users/'+loginResult.id">
              <template slot="title">
                更多
              </template>
              <el-menu-item :index="'/users/'+loginResult.id+'/info'">账号设置</el-menu-item>
              <el-menu-item index="" @click="logout">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="app-content">
      <!-- 缓存 -->
      <keep-alive>
        <router-view :loginResult="loginResult" :isLogin="isLogin"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      loginResult: {
        id: '',
        token: '',
        username: ''
      },
      logoutDialogVisible: false
    }
  },
  methods: {
    //每次页面刷新都到localStorage查询是否有用户信息
    checkLoginState() {
      if (localStorage.getItem('loginResult') !== null) {
        this.isLogin = true
        this.loginResult = JSON.parse(localStorage.getItem('loginResult'))
        console.log('isLogin:', this.isLogin)
        console.log('loginResult:', this.loginResult)
      } else {
        console.log('localStorage为空')
      }
    },
    /**当退出登录时，会提示信息，并删除本地的localStorage，本地的内存数据，以及服务器的token */
    logout() {
      if(!this.isLogin){
        return 
      }
      const h = this.$createElement
      this.$notify({
        title: '退出成功',
        message: h(
          'i',
          {
            style: 'color: teal'
          },
          '再见，' + this.loginResult.username
        )
      })
      localStorage.clear('loginResult')
      console.log('删除服务器的token')
      let header = {
        Authentication: this.loginResult.token
      }
      this.axios
        .delete('/tokens', {
          headers: header
        })
        .then(response => {
          console.log(response.data)
          this.isLogin = false
          this.loginResult = null
        })
        .catch(error => {
          throw error
        })
      //回到首页
      this.$router.push('/')
      window.location.reload()
    }
  },
  // 当刷新时，检查localStorage，如果有用户数据，说明仍在登录状态
  created() {
    this.checkLoginState()
  }
}
</script>

<style>
body {
  font-size: 14px;
  color: #444;
  min-height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

/* header */

.app-header {
  height: 82px;
  width: 100%;
  background-color: #24292c;
}
.app-header-inner {
  width: 1200px;
  margin: 0 auto;
}
.app-header-inner h1 {
  color: #ffffff;
}
.logo {
  position: relative;
  float: left;
  width: 220px;
  height: 44px;
}

.header-nav {
  float: right;
  margin: 35px 0 0;
}
.nav-menu {
  position: relative;
  z-index: 65;
  width: 580px;
  height: 48px;
  padding: 22px 5px 0 0;
  margin: -36px 0 0;
  text-align: left;
  border: 0px;
}

/* 不可删除 */

a {
  color: inherit;
  text-decoration: none;
}
</style>
