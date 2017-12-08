<template>
  <div>
    <!-- Header -->
    <div class="app-header" @keyup.enter="search">
      <div class="app-header-inner">
        <!-- LOGO -->
        <router-link to="/" class="logo">
          <h1>PhotoHub</h1>
        </router-link>
        <!-- 导航栏 -->
        <div class="header-nav">
          <!-- 导航条 -->
          <el-menu class="nav-menu" :default-active="$route.path" :router="true" mode="horizontal" background-color="#24292c" text-color="#999" active-text-color="#ffffff">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item v-if="_isLogin()" :index="`/users/${this._id()}/index`">主页</el-menu-item>
            <el-menu-item v-if="_isLogin()" :index="`/users/${this._id()}/moments`">动态</el-menu-item>
            <el-menu-item v-if="_isLogin()" :index="`/users/${this._id()}/albums`">相册</el-menu-item>
            <el-menu-item v-if="_isLogin()" :index="`/users/${this._id()}/follows`">关注</el-menu-item>
            <el-menu-item index="/activities">活动</el-menu-item>
            <el-menu-item index="/tags">标签</el-menu-item>
            <el-menu-item v-if="_isAdmin()" index="/admin">管理员</el-menu-item>
            <el-submenu v-if="_isLogin()" index="">
              <template slot="title">
                更多
              </template>
              <el-menu-item :index="`/users/${this._id()}/info`">账号设置</el-menu-item>
              <el-menu-item index="" @click="logout">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>

          <!-- 搜索条 -->
          <el-input v-loading.fullscreen.lock="searchLoading" class="nav-search input-with-select" placeholder="请输入标签或用户名" v-model="keyword">
            <el-select v-model="searchOption" slot="prepend" class="select">
              <el-option label="标签" value="tags"></el-option>
              <el-option label="用户" value="users"></el-option>
            </el-select>
            <el-button :disabled="keyword === ''" slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="app-content">
      <!-- 缓存 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoutDialogVisible: false,
      searchOption: 'tags',
      keyword: '',
      searchLoading: false
    }
  },
  methods: {
    /**当退出登录时，会提示信息，并删除本地的localStorage，本地的内存数据，以及服务器的token */
    logout() {
      if (!this._isLogin()) {
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
          '再见，' + this._username()
        )
      })
      localStorage.clear('loginResult')
      console.log('删除服务器的token')
      this.axios
        .delete('/tokens')
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          throw error
        })
      //回到首页
      setTimeout(() => {
        this.$router.push('/')
        window.location.reload()
      }, 2000)
    },
    search() {
      if (this.searchOption === 'users') {
        this.handleSearchUsers()
      } else if (this.searchOption === 'tags') {
        this.handleSearchTags()
      }
    },
    handleSearchUsers(){
      this.$router.push({path: '/search/users', query: {keyword: this.keyword}})
    },
    handleSearchTags() {
      this.searchLoading = true
      let params = { keyword: this.keyword }
      this.axios
        .get(`${this.searchOption}/search`, { params:params })
        .then(response => {
          console.log('搜索成功,将跳转至:', response.data)
          this.searchLoading = false
          if (response.data === this.$route.path) {
            this.$message('搜索结果即为当前页面')
          } else {
            this.$router.push(response.data)
          }
        })
        .catch(error => {
          console.log('搜索失败')
          this.searchLoading = false
          this.$message.error('查询失败,请重新输入关键字')
          this.keyword = ''
        })
    }
  }
}
</script>

<style>
body {
  font-size: 14px;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background-color: #ededef;
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
  float: left;
  margin: 35px 0 0;
}
.nav-menu {
  float: left;
  position: relative;
  z-index: 65;
  width: 670px;
  height: 48px;
  padding: 22px 5px 0 0;
  margin: -36px 0 0;
  text-align: left;
  border: 0px;
}
.nav-search {
  float: right;
  position: relative;
  top: -1px;
  left: 0px;
  width: 300px;
  height: 26px;
  margin: -36px 0 0;
  padding: 2px 10px 2px 32px;
  background-position: 0 -41px;
  z-index: 65;
}
.select {
  width: 80px;
}
/* 不可删除 */
a {
  color: inherit;
  text-decoration: none;
}
</style>
